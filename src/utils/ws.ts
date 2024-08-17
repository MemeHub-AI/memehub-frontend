export const filterHeartbeta = (
  message: MessageEvent<any>,
  heartbeta = 'heartbeta'
) => {
  try {
    const msg = JSON.parse(message.data)
    return msg.type !== heartbeta
  } catch (error) {
    console.error('filterHeartbeta', error)
    return true
  }
}
