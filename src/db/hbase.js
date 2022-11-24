import hbase from 'hbase'

export const client = hbase({
  host: '127.0.0.1',
  port: 10005
})

