document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tableForm');
    const tableContainer = document.getElementById('tableContainer');
    let generatedTables = 0;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const rowCount = document.getElementById('rowCount').value;
        generateTable(rowCount);
    });

    function generateTable(rowCount) {
        let tableHTML = '';

        for (let i = 1; i <= rowCount; i++) {
            generatedTables++;
            tableHTML += `
                <div class="table-wrapper" id="table-${generatedTables}">
                    <table>
                        <thead></thead>
                        <tbody>
                            <tr id="row-${i}-${generatedTables}">
                                <td>${i}</td>
                                <td> <button onclick="toggleInputOrCheckbox(${i}, ${generatedTables})">T</button></td>
                                <td><label><input type="checkbox" name="checkbox-${generatedTables}-A"> A</label></td>
                                <td><label><input type="checkbox" name="checkbox-${generatedTables}-B"> B</label></td>
                                <td><label><input type="checkbox" name="checkbox-${generatedTables}-C"> C</label></td>
                                <td><label><input type="checkbox" name="checkbox-${generatedTables}-D"> D</label></td>
                                <td><label><input type="checkbox" name="checkbox-${generatedTables}-E"> E</label></td>
                                <td>
                                    <button class="plus-button" onclick="addColumns(${i}, ${generatedTables})">+</button>
                                    <button class="minus-button" onclick="removeColumns(${i}, ${generatedTables})">-</button>
                                    <button onclick="freezeTable(${generatedTables})">✓</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }

        tableContainer.innerHTML += tableHTML;
        tableContainer.innerHTML += '<hr>';
    }

    window.addColumns = function(rowNumber, tableNumber) {
        const row = document.querySelector(`#row-${rowNumber}-${tableNumber}`);
        const letters = '_FGHIJKLMNOPQRSTUVWXYZ'.split('');
        const existingColumnsCount = row.querySelectorAll('td').length - 7;

        if (existingColumnsCount < letters.length) {
            const newCell = row.insertCell(-1);
            const newLetter = letters[existingColumnsCount];
            newCell.innerHTML = `
                <td><label><input type="checkbox" name="checkbox-${tableNumber}-${newLetter}"> ${newLetter}</label></td>
            `;
        }
    };

    window.removeColumns = function(rowNumber, tableNumber) {
        const row = document.querySelector(`#row-${rowNumber}-${tableNumber}`);
        
        if (row.querySelectorAll('td').length > 7) {
            row.deleteCell(-1);
        }
    };

    window.toggleInputOrCheckbox = function(rowNumber, tableNumber) {
        const row = document.querySelector(`#row-${rowNumber}-${tableNumber}`);
        const actionButton = row.querySelector('button');
        
        const inputCell = document.createElement('td');
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('name', `text-${tableNumber}`);
        inputCell.appendChild(inputElement);

        const checkboxes = `
            <td><label><input type="checkbox" name="checkbox-${tableNumber}-A"> A</label></td>
            <td><label><input type="checkbox" name="checkbox-${tableNumber}-B"> B</label></td>
            <td><label><input type="checkbox" name="checkbox-${tableNumber}-C"> C</label></td>
            <td><label><input type="checkbox" name="checkbox-${tableNumber}-D"> D</label></td>
            <td><label><input type="checkbox" name="checkbox-${tableNumber}-E"> E</label></td>
        `;

        if (actionButton.innerText === 'Text') {
            row.replaceChild(inputCell, row.cells[1]);
            row.querySelectorAll('td input[type="checkbox"]').forEach(checkbox => checkbox.closest('td').remove());
            row.querySelector('.plus-button').style.display = 'none';
            row.querySelector('.minus-button').style.display = 'none';
            actionButton.innerText = 'Checkbox';
        } else {
            row.replaceChild(document.createElement('td'), row.cells[1]);
            row.cells[1].innerHTML = checkboxes;
            row.querySelector('.plus-button').style.display = 'inline-block';
            row.querySelector('.minus-button').style.display = 'inline-block';
            actionButton.innerText = 'Text';
        }
    };

    window.freezeTable = function(tableNumber) {
        const table = document.getElementById(`table-${tableNumber}`);
        const inputs = table.querySelectorAll('input');

        inputs.forEach(input => {
            input.disabled = true;
            localStorage.setItem(`${tableNumber}-${input.name}`, input.value); // Sauvegarder la valeur du champ dans le cache
        });
    };

    // Restaurer les valeurs du cache lors du rechargement de la page
    window.onload = function() {
        for (let i = 1; i <= generatedTables; i++) {
            const table = document.getElementById(`table-${i}`);
            const inputs = table.querySelectorAll('input');

            inputs.forEach(input => {
                const cachedValue = localStorage.getItem(`${i}-${input.name}`);
                if (cachedValue) {
                    input.value = cachedValue;
                }
            });
        }
    };

    window.removeLastTable = function() {
        if (generatedTables > 0) {
            const lastTable = document.getElementById(`table-${generatedTables}`);
            const lastHR = tableContainer.querySelector('hr:last-child');

            if (lastTable) {
                lastTable.remove();
                generatedTables--;
            }

            if (lastHR) {
                lastHR.remove();
            }
        }
    };
});

