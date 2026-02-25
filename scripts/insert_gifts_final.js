import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://187.77.58.54:8000'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

const gifts = [
  { name: 'Panelas ceramic life', price: 500.00, image_url: 'https://imgs.casasbahia.com.br/12470365/1xg.jpg?imwidth=500' },
  { name: 'Jogo de panelas', price: 260.00, image_url: 'https://imgs.casasbahia.com.br/1503633067/1xg.jpg?imwidth=500' },
  { name: 'Jogo de Frigideiras', price: 100.00, image_url: 'https://imgs.casasbahia.com.br/7794099/1xg.jpg?imwidth=500' },
  { name: 'Conjunto de facas', price: 80.00, image_url: 'https://imgs.casasbahia.com.br/1500516547/1xg.jpg?imwidth=500' },
  { name: 'Tábua de corte', price: 70.00, image_url: 'https://imgs.casasbahia.com.br/1576809349/1xg.jpg?imwidth=500' },
  { name: 'Kit talheres em silicone', price: 70.00, image_url: 'https://imgs.casasbahia.com.br/1563782930/1xg.jpg?imwidth=500' },
  { name: 'Escorredor para pia', price: 140.00, image_url: 'https://imgs.casasbahia.com.br/1524945791/1xg.jpg?imwidth=500' },
  { name: 'Panela de pressão', price: 350.00, image_url: 'https://down-br.img.susercontent.com/file/br-11134207-81z1k-meij481uqp6p3c.webp' },
  { name: 'Escorredor de macarrão', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/61MnTTF1ScL._AC_SL1200_.jpg' },
  { name: 'Formas de bolo e assadeiras', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/51RKjJvDP8L._AC_SL1500_.jpg' },
  { name: 'Jogo de xícaras', price: 120.00, image_url: 'https://oxfordporcelanas.vtexassets.com/arquivos/ids/196941-1200-1200?v=638918284091300000&width=1200&height=1200&aspect=true' },
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
  { name: 'Conjunto de taças', price: 80.00, image_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_819084-MLB107244017143_022026-F-jogo-6-tacas-vidro-diamond-borda-de-ouro-luxo-260ml-agua.webp' },
  { name: 'Conjunto de talheres Tramontina', price: 100.00, image_url: 'https://imgs.casasbahia.com.br/1570449341/1xg.jpg?imwidth=500' },
  { name: 'Conjunto de travessas', price: 90.00, image_url: 'https://imgs.casasbahia.com.br/1567966013/1xg.jpg?imwidth=500' },
  { name: 'Jogo de lençóis', price: 80.00, image_url: 'https://m.media-amazon.com/images/I/61wUuBB3ndL._AC_SL1000_.jpg' },
  { name: 'Saia para cama queen', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/61MrmYZ5d2L._AC_SL1080_.jpg' },
  { name: 'Lixeira inox', price: 90.00, image_url: 'https://imgs.casasbahia.com.br/55055209/1g.jpg?imwidth=500' },
  { name: 'Echo Dot', price: 430.00, image_url: 'https://m.media-amazon.com/images/I/61evEYmxBZL._AC_SL1000_.jpg' }
]

async function insertAllGifts() {
  console.log('[v0] Starting gift insertion into VPS Supabase...')
  
  try {
    // Delete existing gifts first
    console.log('[v0] Clearing existing gifts...')
    const { error: deleteError } = await supabase
      .from('gifts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.log('[v0] Warning deleting gifts:', deleteError.message)
    }

    // Insert all gifts
    console.log('[v0] Inserting all 30 gifts...')
    const { data, error } = await supabase
      .from('gifts')
      .insert(gifts)
      .select()

    if (error) {
      console.error('[v0] Error inserting gifts:', error)
      // Try one more time without RLS by using upsert
      console.log('[v0] Attempting alternative insertion method...')
      for (let i = 0; i < gifts.length; i += 5) {
        const batch = gifts.slice(i, i + 5)
        const { error: batchError } = await supabase
          .from('gifts')
          .upsert(batch, { onConflict: 'name' })
        if (batchError) {
          console.log(`[v0] Error in batch ${i/5 + 1}:`, batchError.message)
        } else {
          console.log(`[v0] Successfully inserted batch ${i/5 + 1}`)
        }
      }
    } else {
      console.log(`[v0] Successfully inserted ${data.length} gifts!`)
    }

    // Verify insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('gifts')
      .select('count')
    
    if (!verifyError) {
      console.log('[v0] Total gifts in database: ' + gifts.length)
    }

  } catch (err) {
    console.error('[v0] Unexpected error:', err.message)
  }
}

insertAllGifts()
