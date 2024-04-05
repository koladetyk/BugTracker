// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract BugTracker {
    enum bugCriticality{Low, Medium, High}

    struct Bug{
        string bugID;
        string description;
        bugCriticality bugCriticality_;
        bool isDone;
    }
    mapping(address => Bug[]) private Users;

    function addBug(string calldata _bugID,string calldata _description, bugCriticality newBugCriticality) external {
        Users[msg.sender].push(Bug({bugID: _bugID, description: _description, bugCriticality_:newBugCriticality, isDone: false}));
    }

    function getBugDetails(uint256 _bugIndex) external view returns (Bug memory){
        Bug storage bug = Users[msg.sender][_bugIndex];
        return bug;
    }

    function updateBugDetails(uint256 _bugIndex, bool _status ) external {
        Users[msg.sender][_bugIndex].isDone = _status;
    }

    function deleteBug(uint256 _bugIndex) external{
        //delete (Users[msg.sender][_bugIndex]);

        // Move the last element into the place to delete
        Users[msg.sender][_bugIndex] = Users[msg.sender][Users[msg.sender].length - 1];

        // Remove the last element
        Users[msg.sender].pop();
    }

    function getBugCount() external view returns(uint256){
        return Users[msg.sender].length;
    }
}