export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
    "function registerCrate(string _crateId, string _farmDetails, string _location)",
    "function updateLocation(string _crateId, uint8 _newStatus, string _location)",
    "function reportDefect(string _crateId, string _ipfsDefectHash, string _location)",
    "function batchUpdateCrate(string _crateId, uint8[] _newStatuses, string[] _locations)",
    "function getCrateDetails(string _crateId) view returns (string r_crateId, string r_farmDetails, uint8 r_currentStatus, string r_ipfsDefectHash, tuple(uint256 timestamp, string location, address handlerAddress, uint8 status)[] r_trackingEvents)",
    "function isCrateRegistered(string _crateId) view returns (bool)",
    "event CrateRegistered(string indexed crateId, string farmDetails, address indexed handler)",
    "event LocationUpdated(string indexed crateId, uint8 newStatus, string location, address indexed handler)",
    "event DefectReported(string indexed crateId, string ipfsDefectHash, address indexed reporter)"
];
