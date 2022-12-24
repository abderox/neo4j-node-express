import hbase from 'hbase'

export const client = hbase({
  host: '127.0.0.1',
  // host: '192.168.137.87',
  port: 10005
})

