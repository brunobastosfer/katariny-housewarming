import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://187.77.58.54:8000";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const gifts = [
  ["Panelas ceramic life", 500.0, "https://imgs.casasbahia.com.br/12470365/1xg.jpg?imwidth=500"],
  ["Jogo de panelas", 260.0, "https://imgs.casasbahia.com.br/1503633067/1xg.jpg?imwidth=500"],
  ["Jogo de Frigideiras", 100.0, "https://imgs.casasbahia.com.br/7794099/1xg.jpg?imwidth=500"],
  ["Conjunto de facas", 80.0, "https://imgs.casasbahia.com.br/1500516547/1xg.jpg?imwidth=500"],
  ["Tábua de corte", 70.0, "https://imgs.casasbahia.com.br/1576809349/1xg.jpg?imwidth=500"],
  ["Kit talheres em silicone", 70.0, "https://imgs.casasbahia.com.br/1563782930/1xg.jpg?imwidth=500"],
  ["Escorredor para pia", 140.0, "https://imgs.casasbahia.com.br/1524945791/1xg.jpg?imwidth=500"],
  ["Panela de pressão", 350.0, "https://down-br.img.susercontent.com/file/br-11134207-81z1k-meij481uqp6p3c.webp"],
  ["Escorredor de macarrão", 70.0, "https://m.media-amazon.com/images/I/61MnTTF1ScL._AC_SL1200_.jpg"],
  ["Formas de bolo e assadeiras", 70.0, "https://m.media-amazon.com/images/I/51RKjJvDP8L._AC_SL1500_.jpg"],
  ["Jogo de xícaras", 120.0, "https://oxfordporcelanas.vtexassets.com/arquivos/ids/196941-1200-1200?v=638918284091300000&width=1200&height=1200&aspect=true"],
  ["Liquidificador", 250.0, "https://imgs.casasbahia.com.br/55063434/1g.jpg?imwidth=500"],
  ["Cafeteira", 180.0, "https://imgs.casasbahia.com.br/55021464/1g.jpg?imwidth=500"],
  ["Sanduicheira", 140.0, "https://imgs.casasbahia.com.br/55066945/1g.jpg?imwidth=500"],
  ["Micro-ondas", 500.0, "https://imgs.casasbahia.com.br/1565678751/1xg.jpg?imwidth=500"],
  ["Ferro de passar", 130.0, "https://imgs.casasbahia.com.br/55064451/1g.jpg?imwidth=500"],
  ["Aspirador", 250.0, "https://imgs.casasbahia.com.br/55065154/1g.jpg?imwidth=500"],
  ["Aspirador", 250.0, "https://imgs.casasbahia.com.br/55065154/1g.jpg?imwidth=500"],
  ["Airfryer 12L Mondial", 550.0, "https://imgs.casasbahia.com.br/55065682/1g.jpg?imwidth=500"],
  ["Ventilador", 280.0, "https://imgs.casasbahia.com.br/55054571/1g.jpg?imwidth=500"],
  ["Conjunto de pratos rasos", 170.0, "https://imgs.casasbahia.com.br/1568207044/1xg.jpg?imwidth=500"],
  ["Conjunto de pratos fundos", 170.0, "https://imgs.casasbahia.com.br/1569658743/1xg.jpg?imwidth=500"],
  ["Jogo de copos", 70.0, "https://imgs.casasbahia.com.br/1574779615/1xg.jpg?imwidth=500"],
  ["Conjunto de taças", 80.0, "https://http2.mlstatic.com/D_NQ_NP_2X_819084-MLB107244017143_022026-F-jogo-6-tacas-vidro-diamond-borda-de-ouro-luxo-260ml-agua.webp"],
  ["Conjunto de talheres Tramontina", 100.0, "https://imgs.casasbahia.com.br/1570449341/1xg.jpg?imwidth=500"],
  ["Conjunto de travessas", 90.0, "https://imgs.casasbahia.com.br/1567966013/1xg.jpg?imwidth=500"],
  ["Jogo de lençóis", 80.0, "https://m.media-amazon.com/images/I/61wUuBB3ndL._AC_SL1000_.jpg"],
  ["Saia para cama queen", 70.0, "https://m.media-amazon.com/images/I/61MrmYZ5d2L._AC_SL1080_.jpg"],
  ["Lixeira inox", 90.0, "https://imgs.casasbahia.com.br/55055209/1g.jpg?imwidth=500"],
  ["Echo Dot", 430.0, "https://m.media-amazon.com/images/I/61evEYmxBZL._AC_SL1000_.jpg"],
];

async function insertAllGifts() {
  console.log("[v0] Starting to insert all 30 gifts into VPS Supabase...");

  try {
    // Clear existing gifts
    console.log("[v0] Clearing existing gifts...");
    const { error: deleteError } = await supabase.from("gifts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError && deleteError.code !== "PGRST102") {
      console.log("[v0] Warning:", deleteError);
    }

    // Insert all gifts in batches
    const batchSize = 10;
    for (let i = 0; i < gifts.length; i += batchSize) {
      const batch = gifts.slice(i, i + batchSize).map(([name, price, image_url]) => ({
        name,
        price,
        image_url,
        purchased: false,
      }));

      console.log(`[v0] Inserting batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(gifts.length / batchSize)}...`);

      const { error } = await supabase.from("gifts").insert(batch);

      if (error) {
        console.error("[v0] Error inserting batch:", error);
      } else {
        console.log(`[v0] Successfully inserted ${batch.length} gifts`);
      }
    }

    console.log("[v0] All gifts inserted successfully!");
  } catch (error) {
    console.error("[v0] Fatal error:", error);
  }
}

insertAllGifts();
