pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract Picture {
    uint256 timestamp;
    address sender;
    string image;
    string caption;

    function Picture(string _image, string _caption) {
        sender = tx.origin;
        timestamp = block.timestamp;
        image = _image;
        caption = _caption;
    }

    function getall()
        returns (
            uint256,
            address,
            string,
            string
        )
    {
        return (timestamp, sender, image, caption);
    }

    function get_timestamp() returns (uint256) {
        return timestamp;
    }

    function get_sender() returns (address) {
        return sender;
    }

    function get_image() returns (string) {
        return image;
    }

    function get_caption() returns (string) {
        return caption;
    }
}

contract Camera {
    uint256 timestamp;
    address sender;
    string name;

    function Camera(string _name) {
        sender = tx.origin;
        timestamp = block.timestamp;
        name = _name;
    }

    function getall()
        returns (
            uint256,
            address,
            string
        )
    {
        return (timestamp, sender, name);
    }

    function get_timestamp() returns (uint256) {
        return timestamp;
    }

    function get_sender() returns (address) {
        return sender;
    }

    function get_name() returns (string) {
        return name;
    }
}

contract App {
    address[] Picture_list;
    uint256 Picture_list_length;

    function get_Picture_list_length() returns (uint256) {
        return Picture_list_length;
    }

    function get_Picture_N(uint256 index)
        returns (
            uint256,
            address,
            string,
            string
        )
    {
        return Picture(Picture_list[index]).getall();
    }

    function get_last_Picture_N(uint256 count, uint256 offset)
        returns (
            uint256[],
            address[],
            string[],
            string[]
        )
    {
        uint256[] memory timestamp = new uint256[](count);
        address[] memory sender = new address[](count);
        string[] memory image = new string[](count);
        string[] memory caption = new string[](count);
        for (uint256 i = offset; i < count; i++) {
            Picture myPicture = Picture(Picture_list[i + offset]);
            timestamp[i + offset] = myPicture.get_timestamp();
            sender[i + offset] = myPicture.get_sender();
            image[i + offset] = myPicture.get_image();
            caption[i + offset] = myPicture.get_caption();
        }
        return (timestamp, sender, image, caption);
    }

    function get_Picture_user_length(address user) returns (uint256) {
        return user_map[user].Picture_list_length;
    }

    function get_Picture_user_N(address user, uint256 index)
        returns (
            uint256,
            address,
            string,
            string
        )
    {
        return Picture(user_map[user].Picture_list[index]).getall();
    }

    function get_last_Picture_user_N(
        address user,
        uint256 count,
        uint256 offset
    )
        returns (
            uint256[],
            address[],
            string[],
            string[]
        )
    {
        uint256[] memory timestamp = new uint256[](count);
        address[] memory sender = new address[](count);
        string[] memory image = new string[](count);
        string[] memory caption = new string[](count);
        for (uint256 i = offset; i < count; i++) {
            Picture myPicture =
                Picture(user_map[user].Picture_list[i + offset]);
            timestamp[i + offset] = myPicture.get_timestamp();
            sender[i + offset] = myPicture.get_sender();
            image[i + offset] = myPicture.get_image();
            caption[i + offset] = myPicture.get_caption();
        }
        return (timestamp, sender, image, caption);
    }

    address[] Camera_list;
    uint256 Camera_list_length;

    function get_Camera_list_length() returns (uint256) {
        return Camera_list_length;
    }

    function get_Camera_N(uint256 index)
        returns (
            uint256,
            address,
            string
        )
    {
        return Camera(Camera_list[index]).getall();
    }

    function get_last_Camera_N(uint256 count, uint256 offset)
        returns (
            uint256[],
            address[],
            string[]
        )
    {
        uint256[] memory timestamp = new uint256[](count);
        address[] memory sender = new address[](count);
        string[] memory name = new string[](count);
        for (uint256 i = offset; i < count; i++) {
            Camera myCamera = Camera(Camera_list[i + offset]);
            timestamp[i + offset] = myCamera.get_timestamp();
            sender[i + offset] = myCamera.get_sender();
            name[i + offset] = myCamera.get_name();
        }
        return (timestamp, sender, name);
    }

    function get_Camera_user_length(address user) returns (uint256) {
        return user_map[user].Camera_list_length;
    }

    function get_Camera_user_N(address user, uint256 index)
        returns (
            uint256,
            address,
            string
        )
    {
        return Camera(user_map[user].Camera_list[index]).getall();
    }

    function get_last_Camera_user_N(
        address user,
        uint256 count,
        uint256 offset
    )
        returns (
            uint256[],
            address[],
            string[]
        )
    {
        uint256[] memory timestamp = new uint256[](count);
        address[] memory sender = new address[](count);
        string[] memory name = new string[](count);
        for (uint256 i = offset; i < count; i++) {
            Camera myCamera = Camera(user_map[user].Camera_list[i + offset]);
            timestamp[i + offset] = myCamera.get_timestamp();
            sender[i + offset] = myCamera.get_sender();
            name[i + offset] = myCamera.get_name();
        }
        return (timestamp, sender, name);
    }

    struct UserInfo {
        address owner;
        bool exists;
        address[] Picture_list;
        uint256 Picture_list_length;
        address[] Camera_list;
        uint256 Camera_list_length;
    }
    mapping(address => UserInfo) public user_map;
    address[] UserInfoList;
    uint256 UserInfoListLength;

    event NewPicture(address sender);

    function new_Picture(string image, string caption) returns (address) {
        address mynew =
            address(new Picture({_image: image, _caption: caption}));
        if (!user_map[tx.origin].exists) {
            user_map[tx.origin] = create_user_on_new_Picture(mynew);
        }
        user_map[tx.origin].Picture_list.push(mynew);

        user_map[tx.origin].Picture_list_length += 1;

        Picture_list.push(mynew);
        Picture_list_length += 1;

        emit NewPicture(tx.origin);

        return mynew;
    }

    function create_user_on_new_Picture(address addr)
        private
        returns (UserInfo)
    {
        address[] storage Picture_list;
        UserInfoList.push(addr);
        return
            UserInfo({
                exists: true,
                owner: addr,
                Picture_list: Picture_list,
                Picture_list_length: 0,
                Camera_list: Camera_list,
                Camera_list_length: 0
            });
    }

    event NewCamera(address sender);

    function new_Camera(string name) returns (address) {
        address mynew = address(new Camera({_name: name}));
        if (!user_map[tx.origin].exists) {
            user_map[tx.origin] = create_user_on_new_Camera(mynew);
        }
        user_map[tx.origin].Camera_list.push(mynew);

        user_map[tx.origin].Camera_list_length += 1;

        Camera_list.push(mynew);
        Camera_list_length += 1;

        emit NewCamera(tx.origin);

        return mynew;
    }

    function create_user_on_new_Camera(address addr)
        private
        returns (UserInfo)
    {
        address[] storage Camera_list;
        UserInfoList.push(addr);
        return
            UserInfo({
                exists: true,
                owner: addr,
                Picture_list: Picture_list,
                Picture_list_length: 0,
                Camera_list: Camera_list,
                Camera_list_length: 0
            });
    }
}
