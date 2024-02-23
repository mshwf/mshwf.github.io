class expensesManager {
    constructor() {
        // Initialize expenses array from localStorage or an empty array if not present
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    }

    // Function to save expenses to localStorage
    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    // Function to add a new entry
    addEntry(expense) {
        if (expense.amount <= 0) {
        }
        else {
            expense.id = Date.now();
            this.expenses.push(expense);
            this.saveExpenses();
        }
    }

    // Function to edit an existing entry
    editEntry(index, newDescription, newAmount) {
        if (index >= 0 && index < this.expenses.length) {
            this.expenses[index].description = newDescription;
            this.expenses[index].amount = newAmount;
            this.saveExpenses();
        } else {
            console.error("Invalid index for editing entry.");
        }
    }

    // Function to delete an entry
    deleteEntry(id) {
        if (id >= 0) {


            const objWithIdIndex = this.expenses.findIndex((obj) => obj.id === id);

            if (objWithIdIndex > -1) {
                this.expenses.splice(objWithIdIndex, 1);
            }

            this.saveExpenses();
        } else {
            console.error("Invalid index for deleting entry.");
        }
    }
}