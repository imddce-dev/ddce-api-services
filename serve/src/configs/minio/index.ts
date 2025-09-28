import { Client } from 'minio'

export const minioClient = new Client({
  endPoint:  process.env.MINIO_IP || '',  
  port: Number(process.env.MINIO_PORT || 9000 ),
  useSSL: false,              
  accessKey: process.env.MINIO_ACCESSKEY || '',
  secretKey: process.env.MINIO_SECRETKEY || ''
})