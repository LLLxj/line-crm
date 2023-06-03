const getElementInnerHtml = (tagName: string, className: string) => {
  let useBpmnNodeName: string
  const nodeKeyList = document.getElementsByClassName(tagName)
  if (nodeKeyList && nodeKeyList?.length) {
    const nodeKey = nodeKeyList.item(0)
    const labelNodes = nodeKey.getElementsByClassName(className)
    const labelNodeKey = labelNodes[0]
    const _nodeName = labelNodeKey?.innerHTML
    useBpmnNodeName = _nodeName
  }
  return useBpmnNodeName
}

export { getElementInnerHtml }