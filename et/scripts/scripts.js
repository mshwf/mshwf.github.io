var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
var yearViewTable;
var monthViewTable;

generateExpensesPieChart();
document.addEventListener('DOMContentLoaded', function () {
    yearViewTable = new DataTable('#yearViewTable', {
        searching: false,
        "columns": [
            { data: "day" },
            { data: "amount" },
            { data: "category" },
            { data: "notes" },
        ]
    });
    monthViewTable = new DataTable('#monthViewTable', {
        searching: true,
        paging: false,
        columns: [
            { data: 'id', title: 'id' },
            { data: 'day', title: 'Day' },
            { data: 'amount', title: 'Amount' },
            { data: 'category', title: 'Category' },
            { data: 'notes', title: 'Notes' }
        ],
        columnDefs: [
            {
                target: 0,
                visible: false,
                searchable: false
            }, {
                target: 5,
                render: function (data, type, row, meta) {
                    return '<button class="btn btn-danger dlt" onclick="deleteExpense(' + row.id + ')">Delete</button>';
                }
            }
        ]
    });

    $('#monthViewTable tbody').on('click', 'dlt', function () {
        table
            .row($(this).parents('tr'))
            .remove()
            .draw();
    });


});

reload();
document.getElementById('date').valueAsDate = new Date();
var chart;
function reload() {
    var $table = $('#monthViewTable')

    expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    updateTotalExpenses();
    updateCurrentMonthExpensesText();
    generateMonthlyExpensesTable();
    // Ensure expenses is an array before proceeding
    if (!Array.isArray(expenses)) {
        console.error("Invalid expenses data.");
        return;
    }

    // Initialize categories object to store aggregated expenses
    var categories = {};

    // Populate the categories object with aggregated expenses
    expenses.forEach(function (expense) {
        categories[expense.category] = (categories[expense.category] || 0) + parseFloat(expense.amount);
    });

    // Update the chart data
    chart.data.labels = Object.keys(categories);
    chart.data.datasets[0].data = Object.values(categories);

    // Update the chart
    chart.update();
}

const myExpensesManager = new expensesManager();
function saveExpense() {

    // Get form values
    var amount = document.getElementById('amount').value;
    var category = document.getElementById('category').value;
    var notes = document.getElementById('notes').value;
    var date = document.getElementById('date').value;

    // Create an object to represent the expense
    var expense = {
        amount: amount,
        category: category,
        notes: notes,
        date: date
    };
    myExpensesManager.addEntry(expense);
    reload();
}
// Function to update the total expenses text based on the sum of expenses in the current month
function updateTotalExpenses() {
    // Get current month and year
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
    var currentYear = currentDate.getFullYear();

    // Get existing expenses from localStorage or initialize an empty array
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Filter expenses for the current month and year
    var currentMonthExpenses = expenses.filter(function (expense) {
        var expenseDate = new Date(expense.date);
        return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Calculate the sum of expenses for the current month
    var sumOfExpenses = currentMonthExpenses.reduce(function (sum, expense) {
        return sum + parseFloat(expense.amount);
    }, 0);

    // Update the total expenses text
    var totalExpensesElement = document.getElementById('totalExpenses');
    if (totalExpensesElement) {
        totalExpensesElement.textContent = sumOfExpenses.toFixed(2);
    } else {
        console.error("Element with ID 'totalExpenses' not found");
    }
}

// Call the updateTotalExpenses function initially
updateTotalExpenses();
// Function to update the current month expenses text
function updateCurrentMonthExpensesText() {
    // Get current month and year
    var currentDate = new Date();
    var currentMonth = currentDate.toLocaleString('default', { month: 'long' });

    // Update the current month expenses text
    var currentMonthExpensesText = document.getElementById('currentMonthExpensesText');
    if (currentMonthExpensesText) {
        currentMonthExpensesText.textContent = currentMonth + ' Expenses';
    } else {
        console.error("Element with ID 'currentMonthExpensesText' not found");
    }
}

// Call the updateCurrentMonthExpensesText function initially
updateCurrentMonthExpensesText();
// Function to export data to CSV
function exportData() {
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (expenses.length === 0) {
        alert('No data to export.');
        return;
    }

    // Create a CSV content
    var csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'amount,category,notes,date\n';

    expenses.forEach(function (expense) {
        csvContent += `${expense.amount},"${expense.category}","${expense.notes}","${expense.date}"\n`;
    });

    // Create a link and trigger a download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
}

// Function to reset data
function resetData() {
    var confirmReset = confirm('Are you sure you want to reset all data?');
    if (confirmReset) {
        localStorage.removeItem('expenses');
        alert('Data reset successfully.');
    }
}

// Function to parse CSV data
function parseCSV(csv) {
    var lines = csv.split('\n');
    var result = [];

    var headers = lines[0].split(',');

    for (var i = 1; i < lines.length; i++) {
        var data = lines[i].split(',');
        if (data.length === headers.length) {
            var item = {};
            for (var j = 0; j < headers.length; j++) {
                // Remove leading/trailing quotes and unescape escaped quotes
                var key = headers[j].trim();
                var value = data[j].trim().replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
                item[key] = value;
            }
            result.push(item);
        }
    }

    return result;
}

// Function to import data from CSV
function importData() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                try {
                    var importedData = parseCSV(e.target.result);
                    localStorage.setItem('expenses', JSON.stringify(importedData));
                    alert('Data imported successfully.');
                } catch (error) {
                    alert('Error importing data. Please check the CSV file format.');
                }
            };

            reader.readAsText(file);
        }
    });

    fileInput.click();
}

// Function to generate the monthly expenses table
function generateMonthlyExpensesTable() {
    var monthlyExpensesTableBody = document.getElementById('monthlyExpensesTableBody');
    var years = {};

    // Populate the months object with aggregated expenses
    expenses.forEach(expense => {
        // var month = new Date(expense.date).toLocaleString('default', { month: 'long' });
        var year = new Date(expense.date).getUTCFullYear()
        var month = new Date(expense.date).getMonth() + 1;
        // If the year is not in the result object, add it
        if (!years[year]) {
            years[year] = {};
        }
        // If the month is not in the result object, add it
        if (!years[year][month]) {
            years[year][month] = {
                month: month,
                amount: 0
            };
        }
        years[year][month].amount += parseFloat(expense.amount);
    });
    console.log("years")
    console.log(years)
    // Clear existing rows
    monthlyExpensesTableBody.innerHTML = '';

    // Populate the table with data
    for (const year in years) {
        for (const month in years[year]) {
            const expenses = years[year][month].amount.toFixed(2); // Assuming you want to display expenses with two decimal places

            const row = document.createElement('tr');
            row.innerHTML = `<td>${year}</td><td>${getMonthName(month)}</td><td>${expenses}</td><td>
         <button class="btn btn-primary" onclick="viewExpenses('${year}', '${month}')">View</button>      </td>`;
            monthlyExpensesTableBody.appendChild(row);
        }
    }
}
function getChartCategories() {
    var categories = {};

    // Populate the categories object with aggregated expenses
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + parseFloat(expense.amount);
    });
    return categories;
}
// Function to generate the expenses pie chart
function generateExpensesPieChart() {
    var ctx = document.getElementById('expensesPieChart').getContext('2d');
    var categories = {};

    // Populate the categories object with aggregated expenses
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + parseFloat(expense.amount);
    });

    // Generate the pie chart
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(getChartCategories()),
            datasets: [{
                data: Object.values(getChartCategories()),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
            }],
        },
    });
}

// Function to view expenses for a specific month
function viewExpenses(year, month) {
    year = parseInt(year);
    month = parseInt(month);
    document.getElementById('expensesDetailsModalLabel').innerText =
        getMonthName(month) + " " + year + " Expenses Details";
    $('#expensesDetailsModal').modal('show');
    document.getElementById('expensesDetailsTableBody')

    // Filter data for the given year and month
    const monthExpenses = expenses.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getUTCFullYear() === year && entryDate.getMonth() + 1 === month;
    });
    console.log("monthExpenses")
    console.log(monthExpenses)


    // Create an object to store expenses details for each day
    const expensesDetailsByDay = {};

    // Process the filtered data
    monthExpenses.forEach(entry => {
        const entryDate = new Date(entry.date);
        const day = entryDate.getDate();

        // If the day is not in the object, add it
        if (!expensesDetailsByDay[day]) {
            expensesDetailsByDay[day] = [];
        }

        // Add the expenses details for the day
        expensesDetailsByDay[day].push({
            id: entry.id,
            day: day,
            amount: parseFloat(entry.amount),
            category: entry.category,
            notes: entry.notes || ''
        });
    });

    // Convert the object to an array
    const resultArray = Object.values(expensesDetailsByDay).flat();
    monthViewTable = $('#monthViewTable').DataTable();
    monthViewTable.clear();
    monthViewTable.rows.add(resultArray);
    monthViewTable.draw();
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
        month: 'long',
    });
}

function deleteExpense(id) {
    var confirmDelete = confirm('Are you sure you want to delete this expense entry?');
    if (confirmDelete) {
        myExpensesManager.deleteEntry(id)
    }
}
