function addGroup(json_array, group) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        data.groups = {};
    }
    if (data.groups[group]) {
        console.log('Error: Group, ' + group + ' name already exists.');
    } else {
        data.groups[group] = [];
    }
    return JSON.stringify(data, null, 4);
}

function removeGroup(json_array, group) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        data.groups = {};
    }
    if (data.groups[group]) {
        delete data.groups[group];
    } else {
        console.log('Error: Not found group, ' + group);
    }
    return JSON.stringify(data, null, 4);
}

function addObject(json_array, group, user) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
    } else {
        if (!data.groups[group]) {
            console.log('Error: Not found group, ' + group);
        } else {
            if (!data.groups[group].includes(user)) {
                data.groups[group].push(user);
            } else {
                console.log('Error: Object, ' + user + ' already exists.');
            }
        }
    }
    return JSON.stringify(data, null, 4);
}

function eraseObject(json_array, group, user) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
    } else {
        if (!data.groups[group]) {
            console.log('Error: Not found group, ' + group);
        } else {
            if (!data.groups[group].includes(user)) {
                console.log('Error: Not found object, ' + user);
            } else {
                data.groups[group] = data.groups[group].filter(item => item !== user);
            }
        }
    }
    return JSON.stringify(data, null, 4);
}

function userExists(json_array, group, user) {
    let exists = false;
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
    } else {
        if (!data.groups[group]) {
            console.log('Error: Not found group, ' + group);
        } else {
            exists = data.groups[group].includes(user);
        }
    }
    return exists;
}

function groupExists(json_array, group) {
    let exists = false;
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
    } else {
        exists = data.groups.hasOwnProperty(group);
    }
    return exists;
}

function meet(json_array, group, object_name) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
        return false;
    }

    function find_object_in_group(group, obj, visited = new Set()) {
        if (visited.has(group)) {
            return false;
        }
        visited.add(group);
        if (data.groups[group]) {
            if (data.groups[group].includes(obj)) {
                return true;
            }
            for (let member of data.groups[group]) {
                if (member.startsWith('group:')) {
                    let subgroup = member.split(':')[1];
                    if (find_object_in_group(subgroup, obj, visited)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    if (!groupExists(json_array, group)) {
        console.log('Error: Not found group, ' + group);
        return false;
    }
    if (object_name.startsWith('user:') || object_name.startsWith('group:')) {
        return find_object_in_group(group, object_name);
    } else {
        console.log('Error: Invalid object format ' + object_name);
        return false;
    }
}

function replaceObject(json_array, old_name, new_name) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
        return JSON.stringify(data, null, 4);
    }
    for (let group in data.groups) {
        let users = data.groups[group];
        for (let i = 0; i < users.length; i++) {
            if (users[i] === old_name) {
                users[i] = new_name;
            }
        }
    }
    return JSON.stringify(data, null, 4);
}

function removeObject(json_array, user) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
        return JSON.stringify(data, null, 4);
    }
    for (let group in data.groups) {
        let users = data.groups[group];
        if (users.includes(user)) {
            data.groups[group] = users.filter(item => item !== user);
        }
    }
    return JSON.stringify(data, null, 4);
}

function renameGroup(json_array, old_name, new_name) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        console.log('Error: Not found groups');
        return JSON.stringify(data, null, 4);
    }
    if (!data.groups[old_name]) {
        console.log('Error: Not found group, ' + old_name);
        return JSON.stringify(data, null, 4);
    }
    if (data.groups[new_name]) {
        console.log('Error: Group, ' + new_name + ' name already exists.');
        return JSON.stringify(data, null, 4);
    }
    data.groups[new_name] = data.groups[old_name];
    delete data.groups[old_name];
    return JSON.stringify(data, null, 4);
}

function renameObject(json_array, group, old_name, new_name) {
    json_array = eraseObject(json_array, group, old_name);
    json_array = addObject(json_array, group, new_name);
    return json_array;
}

function listGroups(json_array) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        return [];
    }
    return Object.keys(data.groups);
}

function listObjects(json_array) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        return [];
    }
    let users = new Set();
    for (let group in data.groups) {
        for (let member of data.groups[group]) {
            if (member.startsWith('user:')) {
                users.add(member);
            }
        }
    }
    return Array.from(users);
}

function listObjectsOfGroup(json_array, group) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups || !data.groups[group]) {
        return [];
    }
    return data.groups[group].filter(member => member.startsWith('user:'));
}

function objectIsInAnyGroup(json_array, name) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        return false;
    }
    for (let group in data.groups) {
        if (data.groups[group].includes(name)) {
            return true;
        }
    }
    return false;
}

function getGroupsOfObject(json_array, name) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups) {
        return [];
    }
    let groups = [];
    for (let group in data.groups) {
        if (data.groups[group].includes(name)) {
            groups.push(group);
        }
    }
    return groups;
}

function getSubgroups(json_array, group) {
    let data = json_array === '' ? {} : JSON.parse(json_array);
    if (!data.groups || !data.groups[group]) {
        return [];
    }
    return data.groups[group]
        .filter(member => member.startsWith('group:'))
        .map(member => member.split(':')[1]);
}
