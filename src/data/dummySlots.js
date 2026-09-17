// Generates fake time slots for a given game, some randomly marked as booked
export function generateSlots(gamePrice) {
  const startHour = 10
  const endHour = 22
  const slots = []

  for (let hour = startHour; hour < endHour; hour++) {
    const isBooked = Math.random() < 0.3 // ~30% randomly booked, for realism
    slots.push({
      id: `${hour}-${hour + 1}`,
      start: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      end: `${hour + 1 > 12 ? hour + 1 - 12 : hour + 1}:00 ${hour + 1 >= 12 ? 'PM' : 'AM'}`,
      price: gamePrice,
      isBooked,
    })
  }
  return slots
}