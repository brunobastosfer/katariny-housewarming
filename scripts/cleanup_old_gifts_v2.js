import { createClient } from '@supabase/supabase-js'

const url = 'http://187.77.58.54:8000'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

const supabase = createClient(url, key)

// Delete ALL gifts first, then re-insert only the 30 new ones
async function cleanupAndReinsert() {
  console.log('Step 1: Deleting ALL gifts...')
  
  // Delete all gifts - need to use a filter that matches everything
  const { error: deleteError } = await supabase
    .from('gifts')
    .delete()
    .gte('id', '00000000-0000-0000-0000-000000000000')
  
  if (deleteError) {
    console.log('Delete error:', deleteError.message)
    console.log('Trying alternative delete method...')
    
    // Try fetching all IDs then deleting one by one
    const { data: allGifts } = await supabase.from('gifts').select('id')
    if (allGifts) {
      for (const gift of allGifts) {
        await supabase.from('gifts').delete().eq('id', gift.id)
      }
      console.log('Deleted', allGifts.length, 'gifts one by one')
    }
  } else {
    console.log('All gifts deleted successfully')
  }
  
  // Verify deletion
  const { data: remaining } = await supabase.from('gifts').select('id')
  console.log('Remaining after delete:', remaining?.length || 0)
  
  if (remaining && remaining.length > 0) {
    console.log('ERROR: Could not delete old gifts. RLS may be blocking deletes.')
    console.log('The gifts table needs a DELETE policy.')
    return
  }
  
  console.log('\nStep 2: Inserting 30 new gifts...')
  
  const gifts = [
    { name: 'Panelas ceramic life', price: 500.00, image_url: 'https://imgs.casasbahia.com.br/12470365/1xg.jpg?imwidth=500' },
    { name: 'Jogo de panelas', price: 260.00, image_url: 'https://imgs.casasbahia.com.br/1503633067/1xg.jpg?imwidth=500' },
    { name: 'Jogo de Frigideiras', price: 100.00, image_url: 'https://imgs.casasbahia.com.br/7794099/1xg.jpg?imwidth=500' },
    { name: 'Conjunto de facas', price: 80.00, image_url: 'https://imgs.casasbahia.com.br/1500516547/1xg.jpg?imwidth=500' },
    { name: 'Tabua de corte', price: 70.00, image_url: 'https://imgs.casasbahia.com.br/1576809349/1xg.jpg?imwidth=500' },
    { name: 'Kit talheres em silicone', price: 70.00, image_url: 'https://imgs.casasbahia.com.br/1563782930/1xg.jpg?imwidth=500' },
    { name: 'Escorredor para pia', price: 140.00, image_url: 'https://imgs.casasbahia.com.br/1524945791/1xg.jpg?imwidth=500' },
    { name: 'Panela de pressao', price: 350.00, image_url: 'https://down-br.img.susercontent.com/file/br-11134207-81z1k-meij481uqp6p3c.webp' },
    { name: 'Escorredor de macarrao', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/61MnTTF1ScL._AC_SL1200_.jpg' },
    { name: 'Formas de bolo e assadeiras', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/51RKjJvDP8L._AC_SL1500_.jpg' },
    { name: 'Jogo de xicaras', price: 120.00, image_url: 'https://oxfordporcelanas.vtexassets.com/arquivos/ids/196941-1200-1200?v=638918284091300000&width=1200&height=1200&aspect=true' },
    { name: 'Liquidificador', price: 250.00, image_url: 'https://imgs.casasbahia.com.br/55063434/1g.jpg?imwidth=500' },
    { name: 'Cafeteira', price: 180.00, image_url: 'https://imgs.casasbahia.com.br/55021464/1g.jpg?imwidth=500' },
    { name: 'Sanduicheira', price: 140.00, image_url: 'https://imgs.casasbahia.com.br/55066945/1g.jpg?imwidth=500' },
    { name: 'Micro-ondas', price: 500.00, image_url: 'https://imgs.casasbahia.com.br/1565678751/1xg.jpg?imwidth=500' },
    { name: 'Ferro de passar', price: 130.00, image_url: 'https://imgs.casasbahia.com.br/55064451/1g.jpg?imwidth=500' },
    { name: 'Aspirador', price: 250.00, image_url: 'https://imgs.casasbahia.com.br/55065154/1g.jpg?imwidth=500' },
    { name: 'Aspirador', price: 250.00, image_url: 'https://imgs.casasbahia.com.br/55065154/1g.jpg?imwidth=500' },
    { name: 'Airfryer 12L Mondial', price: 550.00, image_url: 'https://imgs.casasbahia.com.br/55065682/1g.jpg?imwidth=500' },
    { name: 'Ventilador', price: 280.00, image_url: 'https://imgs.casasbahia.com.br/55054571/1g.jpg?imwidth=500' },
    { name: 'Conjunto de pratos rasos', price: 170.00, image_url: 'https://imgs.casasbahia.com.br/1568207044/1xg.jpg?imwidth=500' },
    { name: 'Conjunto de pratos fundos', price: 170.00, image_url: 'https://imgs.casasbahia.com.br/1569658743/1xg.jpg?imwidth=500' },
    { name: 'Jogo de copos', price: 70.00, image_url: 'https://imgs.casasbahia.com.br/1574779615/1xg.jpg?imwidth=500' },
    { name: 'Conjunto de tacas', price: 80.00, image_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_819084-MLB107244017143_022026-F-jogo-6-tacas-vidro-diamond-borda-de-ouro-luxo-260ml-agua.webp' },
    { name: 'Conjunto de talheres Tramontina', price: 100.00, image_url: 'https://imgs.casasbahia.com.br/1570449341/1xg.jpg?imwidth=500' },
    { name: 'Conjunto de travessas', price: 90.00, image_url: 'https://imgs.casasbahia.com.br/1567966013/1xg.jpg?imwidth=500' },
    { name: 'Jogo de lencois', price: 80.00, image_url: 'https://m.media-amazon.com/images/I/61wUuBB3ndL._AC_SL1000_.jpg' },
    { name: 'Saia para cama queen', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/61MrmYZ5d2L._AC_SL1080_.jpg' },
    { name: 'Lixeira inox', price: 90.00, image_url: 'https://imgs.casasbahia.com.br/55055209/1g.jpg?imwidth=500' },
    { name: 'Echo Dot', price: 430.00, image_url: 'https://m.media-amazon.com/images/I/61evEYmxBZL._AC_SL1000_.jpg' },
  ]
  
  const { data, error } = await supabase.from('gifts').insert(gifts).select()
  
  if (error) {
    console.log('Insert error:', error.message)
  } else {
    console.log('Inserted', data.length, 'gifts successfully')
  }
  
  // Verify final count
  const { data: final } = await supabase.from('gifts').select('id, name, price')
  console.log('\nFinal gift count:', final?.length || 0)
  if (final) {
    final.forEach(g => console.log(`- ${g.name} | R$ ${g.price} | type: ${typeof g.price}`))
  }
}

cleanupAndReinsert()
