// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OrangeProvenanceTracker {
    // Enum representing the current stage of the orange crate in the supply chain
    enum CrateStatus {
        Harvested,
        Processed,
        InTransit,
        Warehoused,
        Retail,
        Disputed
    }

    // Struct detailing each step of the crate's journey
    struct TrackingEvent {
        uint256 timestamp;
        string location;
        address handlerAddress;
    }

    // Struct encapsulating the main entity: the Crate
    struct Crate {
        string crateId;
        string farmDetails; // e.g., "Kalmeshwar Farms, Region: Nagpur"
        CrateStatus currentStatus;
        string ipfsDefectHash; // IPFS CID of photographic evidence if disputed
        TrackingEvent[] trackingEvents; // Historic flow of the crate
    }

    // Storage for all crates
    mapping(string => Crate) private crates;
    
    // Quick lookup to check if a crate exists
    mapping(string => bool) public isCrateRegistered;

    // Events emitted for off-chain indexing (e.g., Subgraph) and frontend listening
    event CrateRegistered(string indexed crateId, string farmDetails, address indexed handler);
    event LocationUpdated(string indexed crateId, CrateStatus newStatus, string location, address indexed handler);
    event DefectReported(string indexed crateId, string ipfsDefectHash, address indexed reporter);

    // Modifier to ensure we only interact with existing crates
    modifier crateExists(string memory _crateId) {
        require(isCrateRegistered[_crateId], "Crate does not exist");
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
            handlerAddress: msg.sender
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
            handlerAddress: msg.sender
        }));

        emit LocationUpdated(_crateId, _newStatus, _location, msg.sender);
    }

    /**
     * @dev Flags the crate as 'Disputed' and stores the IPFS hash of empirical evidence.
     * @param _crateId Target crate ID
     * @param _ipfsDefectHash CID of the photo showing the defect
     * @param _location Location where defect was observed
     */
    function reportDefect(
        string memory _crateId,
        string memory _ipfsDefectHash,
        string memory _location
    ) external crateExists(_crateId) {
        Crate storage crate = crates[_crateId];
        
        crate.currentStatus = CrateStatus.Disputed;
        crate.ipfsDefectHash = _ipfsDefectHash;
        
        crate.trackingEvents.push(TrackingEvent({
            timestamp: block.timestamp,
            location: _location,
            handlerAddress: msg.sender
        }));

        emit DefectReported(_crateId, _ipfsDefectHash, msg.sender);
    }

    /**
     * @dev Pure getter for the frontend interfaces to rapidly retrieve full crate state.
     * @param _crateId Target crate ID
     */
    function getCrateDetails(string memory _crateId) external view crateExists(_crateId) returns (
        string memory crateId,
        string memory farmDetails,
        CrateStatus currentStatus,
        string memory ipfsDefectHash,
        TrackingEvent[] memory trackingEvents
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
}
