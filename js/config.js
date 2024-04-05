// Use Remix to deploy smart contract to local Ganache blockchain.
// Make note of the address the contract was deployed to, and paste it below.

let contractAddress = '0xe8bF9c24003659a50b50ad45327594F4657F2985';

// Define the smart contract ABI (Application Binary Interface).
let contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_bugID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "enum BugTracker.bugCriticality",
				"name": "newBugCriticality",
				"type": "uint8"
			}
		],
		"name": "addBug",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_bugIndex",
				"type": "uint256"
			}
		],
		"name": "deleteBug",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBugCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_bugIndex",
				"type": "uint256"
			}
		],
		"name": "getBugDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "bugID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum BugTracker.bugCriticality",
						"name": "bugCriticality_",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "isDone",
						"type": "bool"
					}
				],
				"internalType": "struct BugTracker.Bug",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_bugIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "updateBugDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]