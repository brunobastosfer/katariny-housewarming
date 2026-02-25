import { createClient } from '@supabase/supabase-js'

const url = 'http://187.77.58.54:8000'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

const supabase = createClient(url, key)

async function main() {
  // First, check all gifts
  const { data: allGifts, error: fetchError } = await supabase
    .from('gifts')
    .select('id, name, price, image_url, purchased, purchaser_name')
    .order('name')

  if (fetchError) {
    console.log('Fetch error:', fetchError.message)
    return
  }

  console.log('Total gifts:', allGifts.length)
  
  // Show first 5 gifts to understand the data
  allGifts.slice(0, 5).forEach(g => {
    console.log(`- ${g.name} | price: ${g.price} (${typeof g.price}) | image: ${g.image_url?.substring(0, 50)} | purchased: ${g.purchased}`)
  })

  // Find old gifts with unsplash images
  const oldGifts = allGifts.filter(g => g.image_url && g.image_url.includes('unsplash.com'))
  console.log('\nOld gifts with unsplash images:', oldGifts.length)

  // Find new gifts with real images
  const newGifts = allGifts.filter(g => !g.image_url || !g.image_url.includes('unsplash.com'))
  console.log('New gifts with real images:', newGifts.length)

  // Delete old gifts with unsplash images
  if (oldGifts.length > 0) {
    const oldIds = oldGifts.map(g => g.id)
    const { error: deleteError } = await supabase
      .from('gifts')
      .delete()
      .in('id', oldIds)

    if (deleteError) {
      console.log('Delete error:', deleteError.message)
    } else {
      console.log(`\nDeleted ${oldGifts.length} old gifts with unsplash images`)
    }
  }

  // Check remaining gifts
  const { data: remaining, error: remainError } = await supabase
    .from('gifts')
    .select('id, name, price, image_url, purchased')
    .order('name')

  if (remainError) {
    console.log('Remain error:', remainError.message)
    return
  }

  console.log('\nRemaining gifts:', remaining.length)
  remaining.forEach(g => {
    console.log(`- ${g.name} | R$ ${g.price} | purchased: ${g.purchased} | img: ${g.image_url?.substring(0, 60)}`)
  })
}

main()
