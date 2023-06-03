
import OssFile from '@/services/fileUpload'

export async function previewFileUrl (key: string) {
  const data = await OssFile.getFileUrl({
    key: key
  })
  if (data.code === 0) {
    window.open(data.result.url, '_blank')
  } 
}
export default { previewFileUrl }