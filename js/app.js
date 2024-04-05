// Define contract globally
let contract;

// Initialize web3 and create the contract instance
async function init() {
    try {
        await getAccount(); 
        contract = new web3.eth.Contract(contractABI, contractAddress);
        await createBugList(); 
    } catch (error) {
        console.error('Failed to initialize web3, accounts, or contract:', error);
    }
}

// Run the init function when the document is ready
$(document).ready(init);

// jQuery is a JS library designed to simplify working with the DOM (Document Object Model) and event handling.
// This code runs the function createBugList() only after the DOM has completely loaded, ensuring safe DOM element interaction.
//$(document).ready(createBugList());


//auto focus on input of add task modal
$('#add-bug-container').on('shown.bs.modal', function () {
	$('#new-bug').trigger('focus');
});

async function createBugList() {
    try {
        const bugNum = await contract.methods.getBugCount().call({ from: web3.eth.defaultAccount });
        console.log(`Total bugs: ${bugNum}`);

		// Update the bug count display
        document.getElementById('bug-count').innerText = `Total bugs: ${bugNum}`;
        
        // Clear the list
        const list = document.getElementById('list');
        list.innerHTML = '';  

		//if list is not empty
        if (bugNum != 0) {
            for (let bugIndex = 0; bugIndex < bugNum; bugIndex++) {
                try {
					//add bug to List
                    let bug = await contract.methods.getBugDetails(bugIndex).call({ from: web3.eth.defaultAccount });
                    if (bug[0] != '') { 
						let criticalityString = ['Low', 'Medium', 'High'][bug.bugCriticality_];
						addBugToList(bugIndex, bug.bugID, bug.description, criticalityString, bug.isDone);
					}
                } catch (error) {
                    console.error(`Failed to get bug at index ${bugIndex}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error retrieving bug count from blockchain:', error);
    }
}



//function addBugToList(id, name, status) {
function addBugToList(id, bugID, description, criticality, isDone) {
	// get the id of the <ul> then append children to it
	let list = document.getElementById('list');
	let item = document.createElement('li');
	item.classList.add(
		'list-group-item',
		'border-0',
		'd-flex',
		'justify-content-between',
		'align-items-center'
	);
	item.id = 'item-' + id;
	// add text to the <li> element
	//let bug = document.createTextNode(name);
	// Append the bug name to the list item
    //item.appendChild(bug);
    
    // Append the list item to the list
    //list.appendChild(item);
	// Creates a text node for the bug ID and append it
    let textBugID = document.createTextNode(`ID: ${bugID} - `);
	// Append the bug id to the list item
    item.appendChild(textBugID);

    // Creates a text node for the description and append it
    let textDescription = document.createTextNode(`Description: ${description} - `);
	// Append the description to the list item
    item.appendChild(textDescription);

    // Creates a text node for the criticality and append it
    let textCriticality = document.createTextNode(`Criticality: ${criticality} - `);
	// Append the criticality to the list item
    item.appendChild(textCriticality);

    // Creates a text node for the status and append it
    let textStatus = document.createTextNode(`Status: ${isDone ? 'Done' : 'Not Done'}`);
	// Append the status to the list item
    item.appendChild(textStatus);

    if (isDone) {
        item.classList.add('bug-done');
    }

    // Append the whole item to the list
    list.appendChild(item);
}

// change the status of the bug stored on the blockchain
async function changeBugStatus(id, bugIndex) {
	// get checkbox element
	let checkbox = document.getElementById(id);
	// get the id of the <li> element
	let textId = id.replace('-checkbox', '');
	// get the <li> element
	let text = document.getElementById(textId);
	try {
		await contract.methods
			.updateBugStatus(bugIndex, checkbox.checked)
			.send({
				from: web3.eth.defaultAccount
			});
		if (checkbox.checked) {
			text.classList.add('bug-done');
		} else {
			text.classList.remove('bug-done');
		}
	} catch (error) {
		console.log('Failed to change status of bug. Index: ' + bugIndex);
	}
}

async function addBug(bugID, description, criticality) {
    try {
        await contract.methods.addBug(bugID, description, criticality).send({ from: web3.eth.defaultAccount, gas: 500000 });
        console.log('Bug added successfully');
        // Reset the form
        //document.getElementById('bug-id').value = '';
        //document.getElementById('bug-description').value = '';
        //document.getElementById('bug-criticality').value = '0'; 
        await createBugList();
    } catch (error) {
        console.error('Failed to save bug to blockchain:', error);
    }
}


function saveBug() {
	//get values
    const bugID = document.getElementById('bug-id').value;
    const description = document.getElementById('bug-description').value;
    const criticality = parseInt(document.getElementById('bug-criticality').value);

	//add bug then reset values 
    addBug(bugID, description, criticality).then(() => {
        $('#add-bug-container').modal('hide');
        document.getElementById('bug-id').value = '';
        document.getElementById('bug-description').value = '';
        document.getElementById('bug-criticality').value = '0'; 
    }).catch(error => {
        console.error('Submission failed:', error);
    });
}

async function deleteBug() {
    const bugIndex = document.getElementById('delete-bug-index').value; 

    try {
        // delete bug
        await contract.methods.deleteBug(bugIndex).send({ from: web3.eth.defaultAccount });
        console.log('Bug deleted successfully');
        // Close the modal after successful deletion
        $('#delete-bug-modal').modal('hide');
        await createBugList();
    } catch (error) {
        console.error('Failed to delete bug from blockchain:', error);
    }
}

async function updateBug() {

	//const bugIndex = parseInt(document.getElementById('bug-index').value);
	const bugIndex = document.getElementById('update-bug-index').value; 
	const status = document.getElementById('update-bug-isDone').value === 'true'; 
	//const bugID = document.getElementById('update-bug-id').value;
    //const description = document.getElementById('update-bug-description').value;
    //const criticality = parseInt(document.getElementById('update-bug-criticality').value);

	console.log({ bugIndex, status });

    try {
        // update bug
        await contract.methods.updateBugDetails(bugIndex,status).send({ from: web3.eth.defaultAccount });
        console.log('Bug updated successfully');
        // Close the modal after successful deletion
        $('#update-bug-modal').modal('hide');
        await createBugList();
    } catch (error) {
        console.error('Failed to update bug from blockchain:', error);
    }
}

  
