import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://187.77.58.54:8000'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Insert batch 1 (10 items)
const batch1 = [
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
]

// Insert batch 2 (10 items)
const batch2 = [
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
]

// Insert batch 3 (10 items)
const batch3 = [
  { name: 'Conjunto de pratos rasos', price: 170.00, image_url: 'https://imgs.casasbahia.com.br/1568207044/1xg.jpg?imwidth=500' },
  { name: 'Conjunto de pratos fundos', price: 170.00, image_url: 'https://imgs.casasbahia.com.br/1569658743/1xg.jpg?imwidth=500' },
  { name: 'Jogo de copos', price: 70.00, image_url: 'https://imgs.casasbahia.com.br/1574779615/1xg.jpg?imwidth=500' },
  { name: 'Conjunto de taças', price: 80.00, image_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_819084-MLB107244017143_022026-F-jogo-6-tacas-vidro-diamond-borda-de-ouro-luxo-260ml-agua.webp' },
  { name: 'Conjunto de talheres Tramontina', price: 100.00, image_url: 'https://imgs.casasbahia.com.br/1570449341/1xg.jpg?imwidth=500' },
  { name: 'Conjunto de travessas', price: 90.00, image_url: 'https://imgs.casasbahia.com.br/1567966013/1xg.jpg?imwidth=500' },
  { name: 'Jogo de lençóis', price: 80.00, image_url: 'https://m.media-amazon.com/images/I/61wUuBB3ndL._AC_SL1000_.jpg' },
  { name: 'Saia para cama queen', price: 70.00, image_url: 'https://m.media-amazon.com/images/I/61MrmYZ5d2L._AC_SL1080_.jpg' },
  { name: 'Lixeira inox', price: 90.00, image_url: 'https://imgs.casasbahia.com.br/55055209/1g.jpg?imwidth=500' },
  { name: 'Echo Dot', price: 430.00, image_url: 'https://m.media-amazon.com/images/I/61evEYmxBZL._AC_SL1000_.jpg' },
]

async function insertGifts() {
  try {
    console.log('[v0] Inserting batch 1...')
    const { error: error1 } = await supabase.from('gifts').insert(batch1)
    if (error1) throw error1
    console.log('[v0] Batch 1 inserted successfully')

    console.log('[v0] Inserting batch 2...')
    const { error: error2 } = await supabase.from('gifts').insert(batch2)
    if (error2) throw error2
    console.log('[v0] Batch 2 inserted successfully')

    console.log('[v0] Inserting batch 3...')
    const { error: error3 } = await supabase.from('gifts').insert(batch3)
    if (error3) throw error3
    console.log('[v0] Batch 3 inserted successfully')

    console.log('[v0] All 30 gifts inserted successfully!')
  } catch (error) {
    console.error('[v0] Error inserting gifts:', error)
  }
}

insertGifts()
