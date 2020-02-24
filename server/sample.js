let first = [
  { id: 1, photo: 'random' },
  { id: 2, photo: 'random2' },
]

let sec = [
  { id: 1, photo: 'random' },
  { id: 2, photo: 'random2' },
  { id: 3, photo: 'random3' },
  { id: 4, photo: 'random4' },
]

let result = sec.filter(s => !first.find(f => f.id === s.id))

console.log(result)
