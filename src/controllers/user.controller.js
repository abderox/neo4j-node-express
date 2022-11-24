import {client} from '../db/hbase.js'

export const addUser = async (req, res, idUser) => {
    console.log("addUser-1")
    const unique_id = idUser;
    const user = req.body;
    const columns = Object.keys(user);
    if(columns.length === 0) {
        return res.status(400).send('No data provided')
    }
    if(!columns.includes('username') || !columns.includes('email') || !columns.includes('password')) {
        return res.status(400).send('Missing required fields')
    }
    console.log("addUser-2")
    const data = [];
    columns.forEach(column => {
        if(column == 'username' || column == 'email' || column == 'password') {
            data.push({
                column: `general_info:${column}`,
                $: user[column]
            })
        } else {
            data.push({
                column: `personal_info:${column}`,
                $: user[column]
            })
        }
    })

    console.log("addUser-3")
    
    client.table('user_test')
    .row(unique_id)
    .put(data, function (err, success) {
        if (err) return res.status(500).send(err)
        console.log('success', success);
        return res.status(200).send(success)
    })
}



export const getUsers = async (req, res) => {
    client
    .table('user_test')
    .scan({
        startRow: '1',
        maxVersions: 1,
    }, (err, rows) =>
        {
            let set = new Set()
            var data = []
            rows.forEach(row => {
                console.log('row', row)
                if (!set.has(row.key)) {
                    let row_data = {}
                    set.add(row.key)
                    row_data["_id"] = row.key
                    row_data[row.column.split(':')[1]] = row.$
                    data.push(row_data)
                } else {
                    data.forEach((item, index) => {
                        if (item.id === row.key) {
                            data[index][row.column.split(':')[1]] = row.$
                        }
                    })        
                }
            })   
            console.log('data', JSON.stringify(data));
            return res.status(200).send(data)
        }
    )
}