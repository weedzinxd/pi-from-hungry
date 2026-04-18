// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HungerReliefAgent {
    struct Hotspot {
        uint256 id;
        string locationHash;
        uint256 severity;
        uint256 estimatedCost;
        bool isActive;
        uint256 createdAt;
    }
    
    struct Donation {
        address donor;
        uint256 piAmount;
        uint256 gvcValue;
        uint256 timestamp;
        uint256 hotspotId;
    }
    
    mapping(uint256 => Hotspot) public hotspots;
    mapping(uint256 => Donation[]) public donations;
    uint256 public hotspotCount;
    uint256 public constant GVC_MULTIPLIER = 314159;
    
    address public operator;
    address public treasury;
    
    event HotspotRegistered(uint256 id, string locationHash, uint256 severity);
    event DonationReceived(address indexed donor, uint256 amount, uint256 gvcValue);
    
    constructor(address _treasury) {
        operator = msg.sender;
        treasury = _treasury;
    }
    
    function registerHotspot(string memory _locationHash, uint256 _severity, uint256 _cost) external returns (uint256) {
        require(msg.sender == operator, "Only AI agent");
        uint256 id = hotspotCount++;
        hotspots[id] = Hotspot(id, _locationHash, _severity, _cost, true, block.timestamp);
        emit HotspotRegistered(id, _locationHash, _severity);
        return id;
    }
    
    function donate(uint256 _hotspotId) external payable {
        require(hotspots[_hotspotId].isActive, "Hotspot resolved");
        uint256 gvcValue = (msg.value * GVC_MULTIPLIER) / 1000;
        donations[_hotspotId].push(Donation(msg.sender, msg.value, gvcValue, block.timestamp, _hotspotId));
        emit DonationReceived(msg.sender, msg.value, gvcValue);
    }
    
    function getHotspotSummary(uint256 _id) external view returns (uint256 totalDonated, uint256 donorCount, bool isResolved) {
        Donation[] memory d = donations[_id];
        for(uint i = 0; i < d.length; i++) { totalDonated += d[i].piAmount; }
        return (totalDonated, d.length, !hotspots[_id].isActive);
    }
}
