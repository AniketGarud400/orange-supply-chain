// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OrangeProvenanceTracker
 * @dev A decentralized system for tracking the lifecycle and quality of Nagpur Oranges.
 * This contract handles the provenance, cold chain transit events, and quality assurance logs.
 */
contract OrangeProvenanceTracker {
    
    // Enum representing the lifecycle stages of an orange crate
    enum CrateStatus { Harvested, Processed, InTransit, Warehoused, Retail, Disputed }

    /**
     * @dev Struct capturing a single point-in-time logistics event.
     */
    struct TrackingEvent {
        uint256 timestamp;
        string location;
        address handlerAddress;
        CrateStatus status;
    }

    /**
     * @dev Struct encapsulating the main entity: the Crate
     */
    struct Crate {
        string crateId;
        string farmDetails;
        CrateStatus currentStatus;
        string ipfsDefectHash; // CID for proof of defect (photo/report)
        TrackingEvent[] trackingEvents;
    }

    // State Mapping: Crate ID -> Crate Details
    mapping(string => Crate) private crates;
    
    // Mapping to check if a crate ID exists
    mapping(string => bool) public isCrateRegistered;

    // Events for transparency and off-chain indexing
    event CrateRegistered(string indexed crateId, string farmDetails, address indexed registeredBy);
    event LocationUpdated(string indexed crateId, CrateStatus newStatus, string location, address indexed handler);
    event DefectReported(string indexed crateId, string ipfsHash, address indexed reportedBy);

    // Modifier to ensure only registered crates are modified
    modifier crateExists(string memory _crateId) {
        require(isCrateRegistered[_crateId], "Crate ID does not exist in registry");
        _;
    }

    /**
     * @dev Implements the "Scan-to-Pair" logic, linking a physical QR ID to new farm data.
     * Starts the crate journey at the Harvested status.
     * @param _crateId Unique ID from pre-printed QR
     * @param _farmDetails String data representing origin farm
     * @param _location The initial scanning location (e.g., Farm Address)
     */
    function registerCrate(
        string memory _crateId,
        string memory _farmDetails,
        string memory _location
    ) external {
        require(!isCrateRegistered[_crateId], "Crate already registered");

        Crate storage newCrate = crates[_crateId];
        newCrate.crateId = _crateId;
        newCrate.farmDetails = _farmDetails;
        newCrate.currentStatus = CrateStatus.Harvested;
        
        newCrate.trackingEvents.push(TrackingEvent({
            timestamp: block.timestamp,
            location: _location,
            handlerAddress: msg.sender,
            status: CrateStatus.Harvested
        }));

        isCrateRegistered[_crateId] = true;

        emit CrateRegistered(_crateId, _farmDetails, msg.sender);
    }

    /**
     * @dev Pushes a new TrackingEvent and updates currentStatus.
     * @param _crateId Target crate ID
     * @param _newStatus New lifecycle stage
     * @param _location Scan location (e.g., Processing Center)
     */
    function updateLocation(
        string memory _crateId,
        CrateStatus _newStatus,
        string memory _location
    ) external crateExists(_crateId) {
        Crate storage crate = crates[_crateId];
        
        crate.currentStatus = _newStatus;
        crate.trackingEvents.push(TrackingEvent({
            timestamp: block.timestamp,
            location: _location,
            handlerAddress: msg.sender,
            status: _newStatus
        }));

        emit LocationUpdated(_crateId, _newStatus, _location, msg.sender);
    }

    /**
     * @dev Records a quality defect with cryptographic proof (IPFS hash).
     * Automatically sets the status to Disputed.
     * @param _crateId Target crate ID
     * @param _ipfsHash CID (Content Identifier) from IPFS containing evidence
     * @param _location Location where defect was identified
     */
    function reportDefect(
        string memory _crateId,
        string memory _ipfsHash,
        string memory _location
    ) external crateExists(_crateId) {
        Crate storage crate = crates[_crateId];
        
        crate.currentStatus = CrateStatus.Disputed;
        crate.ipfsDefectHash = _ipfsHash;
        
        crate.trackingEvents.push(TrackingEvent({
            timestamp: block.timestamp,
            location: _location,
            handlerAddress: msg.sender,
            status: CrateStatus.Disputed
        }));

        emit DefectReported(_crateId, _ipfsHash, msg.sender);
        emit LocationUpdated(_crateId, CrateStatus.Disputed, _location, msg.sender);
    }

    /**
     * @dev View function to get ALL details of a crate for consumer/QA verification.
     */
    function getCrateDetails(string memory _crateId) external view crateExists(_crateId) returns (
        string memory r_crateId,
        string memory r_farmDetails,
        CrateStatus r_currentStatus,
        string memory r_ipfsDefectHash,
        TrackingEvent[] memory r_trackingEvents
    ) {
        Crate storage crate = crates[_crateId];
        return (
            crate.crateId,
            crate.farmDetails,
            crate.currentStatus,
            crate.ipfsDefectHash,
            crate.trackingEvents
        );
    }

    /**
     * @dev Allows pushing multiple tracking events and status updates for a single crate in one transaction.
     * Useful for catch-up data entry or optimizing gas costs in MetaMask flows.
     * @param _crateId Target crate ID
     * @param _newStatuses Array of new lifecycle stages
     * @param _locations Array of scan locations corresponding to statuses
     */
    function batchUpdateCrate(
        string memory _crateId,
        CrateStatus[] memory _newStatuses,
        string[] memory _locations
    ) external crateExists(_crateId) {
        require(_newStatuses.length == _locations.length, "Arrays length mismatch");
        Crate storage crate = crates[_crateId];

        for (uint256 i = 0; i < _newStatuses.length; i++) {
            crate.currentStatus = _newStatuses[i];
            crate.trackingEvents.push(TrackingEvent({
                timestamp: block.timestamp,
                location: _locations[i],
                handlerAddress: msg.sender,
                status: _newStatuses[i]
            }));
            emit LocationUpdated(_crateId, _newStatuses[i], _locations[i], msg.sender);
        }
    }
}
