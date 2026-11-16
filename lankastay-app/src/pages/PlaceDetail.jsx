import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';

const placesData = {
  sigiriya: {
    title: "Sigiriya",
    subtitle: "Ancient rock fortress & royal history",
    image: "/images/ssg.jpg",
    rating: "4.8 (2.5k reviews)",
    bestTime: "1 Day",
    entryFeeText: "LKR 3,000",
    distance: "8 km",
    about: "Sigiriya Rock Fortress, also known as Lion Rock, is one of Sri Lanka's most iconic historical and cultural landmarks. Located in the Matale District, Sigiriya is an ancient rock fortress surrounded by beautiful gardens, water features and breathtaking natural scenery. Built during the reign of King Kashyapa in the 5th century, Sigiriya is famous for its remarkable architecture, ancient frescoes, landscaped gardens and impressive lion-shaped entrance. It is also recognized as a UNESCO World Heritage Site.",
    highlights: ["Lion Rock Summit & Gateway", "Ancient Water Gardens", "World-Famous Frescoes", "Mirror Wall"],
    thingsToDo: ["Climb the Rock Fortress", "Explore the Museum", "Village Tour & Bullock Cart Ride", "Pidurangala Rock Sunrise Hike"],
    mapQuery: "Sigiriya Rock Fortress Sri Lanka",
    gallery: [
      "https://th.bing.com/th/id/R.dade39779e7549015f83af8f8782e6e8?rik=IHFleItx%2by2chw&riu=http%3a%2f%2fwww.pearlceylon.com%2fimages%2fdestination%2fsigiriya%2fsigiriya-by-air.jpg&ehk=qBvBwGXJvH%2fks4lehtxalJjDvmSDg8BAUkxTRWpI%2bWo%3d&risl=&pid=ImgRaw&r=0",
      "https://thumbs.dreamstime.com/b/ancient-wall-paintings-sigiriya-lion-s-rock-palace-27281434.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.e5-ZHtrhi-orfguLuMRpUQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.c8_GMykTKKaCGnFwN0G3BAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.VgCE7NlMfh67cDCraRS5ygHaF3?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.IoTc8bT_lgvhZdbUohvrxAHaE7?r=0&w=670&h=446&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.KoseZ6POw6QBdr7ABomh9QHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.nALI6hPPfoMaip4C4zRjhgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.cO5HM_sd_CrGadG2yxv3mwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.QB4usNBVlXBRDolSVOiLSAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  galle: {
    title: "Galle",
    subtitle: "Historic Dutch Fort & coastal charm",
    image: "/images/glft.webp",
    rating: "4.9 (3.1k reviews)",
    bestTime: "1-2 Days",
    entryFeeText: "Free Entry",
    distance: "2 km",
    about: "Galle is one of Sri Lanka's most beautiful coastal destinations, famous for its rich colonial history, charming architecture, golden beaches and breathtaking ocean view. Located on the southern coast of Sri Lanka, Galle is home to the world-famous Galle Fort, a UNESCO World Heritage site. The city beautifully combines Portuguese, Dutch and British architectural influences with modern cafes, boutique shops and traditional Sri Lankan culture. Visitors can explore historic streets, enjoy peaceful beach experiences, watch spectacular sunsets and discover the beauty of Sri Lanka's southern coastline.",
    highlights: ["17th Century Dutch Fort Walls", "Galle Lighthouse", "Maritime Archeology Museum", "Boutique Cafes & Shops"],
    thingsToDo: ["Walk along the Ramparts", "Visit Galle Lighthouse", "Explore Dutch Reformed Church", "Sunset Watching at Flag Rock"],
    mapQuery: "Galle Fort Sri Lanka",
    gallery: [
      "https://tse1.mm.bing.net/th/id/OIP.9OtT2PkMdWMh6e3gXGvnUwHaEj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://d3e1m60ptf1oym.cloudfront.net/c6660c47-c004-4332-a988-a6c1cbbd1ca3/JW_012219_6377_xgaplus.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.tO_msHEAKGr2aKQ7gApYAAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://th.bing.com/th?id=OIF.FaH3DeflhUHAVtFwDE%2bk8Q&r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.qIYAHgOYQv6ieaWPBjlViAHaEB?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://th.bing.com/th/id/R.d56533072a524302a637fb7ba4829879?rik=vSYQkKudvBSJsA&pid=ImgRaw&r=0",
      "https://tse4.mm.bing.net/th/id/OIP.QZZVtXSUBXzZWZ-cP2qzhAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.-tienPR6K2w6aows6URxLwHaGy?r=0&w=546&h=501&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.53QQtPgOlpsfno6-rE8mlAHaD4?r=0&w=600&h=315&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.3dZLx35Mtu24Hy-fgos7-gHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  ella: {
    title: "Ella",
    subtitle: "Misty mountains, tea estates & Nine Arch Bridge",
    image: "/images/ellao.avif",
    rating: "4.9 (4.2k reviews)",
    bestTime: "2-3 Days",
    entryFeeText: "Free Entry",
    distance: "3 km",
    about: "Ella is one of Sri Lanka's most beautiful hill-country destinations, famous for its misty mountains, lush green tea plantations, breathtaking waterfalls and scenic railway landscape. Located in the Badulla District of Uva province, Ella is a paradise for nature lovers, adventure seekers and travellers looking for a peaceful escape. The destination is especially popular for the iconic Nine Arch Bridge, Little Adam's Peak and spectacular views across Ella Gap. Whether you enjoy hiking through mountain trails, exploring hidden waterfalls, experiencing scenic train journeys or relaxing in the cool mountain atmosphere, Ella offers an unforgettable travel experience.",
    highlights: ["Nine Arch Bridge", "Little Adam's Peak", "Ravana Falls & Caves", "Lush Tea Plantations"],
    thingsToDo: ["Hike Little Adam's Peak", "Photograph Nine Arch Bridge", "Bathe in Ravana Waterfalls", "Scenic Train Ride to Ella"],
    mapQuery: "Ella Nine Arch Bridge Sri Lanka",
    gallery: [
      "https://tse2.mm.bing.net/th/id/OIP.9Jt2p9zrSwp3Ahs1EwphkAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.plk6MYEsbmqgc_9V5R0hbwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://thumbs.dreamstime.com/b/bomburu-ella-fantastic-waterfall-hill-side-sri-lanka-fantastic-cascade-hill-side-sri-lanka-drizzling-to-251681973.jpg",
      "https://tse1.mm.bing.net/th/id/OIP.0mDVmHtnPWLU4wN0GoDgEgHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.5fjwp3E6wrV3vzjGiqfPlAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://th.bing.com/th/id/R.0a9a67b4fb7954ff1c11cfd988623fdd?rik=TV7DBfxt7wrJJg&pid=ImgRaw&r=0",
      "https://tse2.mm.bing.net/th/id/OIP.tpEOr-OtggkzrpT5myMkiQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.sYlHZDFYhJG-CG5r0Szt6wHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.b1HLrBB1T4GCkYfpPSBHNQHaEH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.N4ZEPkQaG4zqViujxq6yuAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  kandy: {
    title: "Kandy",
    subtitle: "Cultural capital & Temple of the Sacred Tooth Relic",
    image: "https://tse1.mm.bing.net/th/id/OIP.F8J5taXv5Mjqqk98kYpTEQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: "4.7 (2.8k reviews)",
    bestTime: "1-2 Days",
    entryFeeText: "LKR 2,000",
    distance: "1 km",
    about: "Kandy is one of Sri Lanka's most beautiful and culturally significant destinations, famous for its ancient Buddhist heritage, royal history, scenic mountain landscapes and traditional Kandyan culture. Located in the Central province, Kandy was the last capital of the ancient Sinhala kings before British rule in 1815. The city is home to the sacred Temple of the Tooth Relic, a UNESCO World Heritage site, and the beautiful Kandy Lake. Surrounded by green hills and a peaceful natural environment, Kandy offers a wonderful combination of historical gardens and unforgettable cultural experiences.",
    highlights: ["Temple of the Sacred Tooth Relic", "Kandy Lake Scenic Walk", "Royal Botanical Gardens Peradeniya", "Traditional Cultural Dance Show"],
    thingsToDo: ["Visit Temple of the Tooth", "Stroll around Kandy Lake", "Explore Peradeniya Botanical Gardens", "Shop at Kandy City Center"],
    mapQuery: "Temple of the Sacred Tooth Relic Kandy Sri Lanka",
    gallery: [
      "https://tse1.mm.bing.net/th/id/OIP.Ubp9AMxk7mIwncJrUOHt3gHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.uQdl0TNW0sUOX0K5SCs4MAHaEl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.Luf7zDslik0QuS6ALkja3AHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://www.andbeyond.com/wp-content/uploads/sites/5/kandy-3.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.1aXUZQxzzQrEgLg35FbMGQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.Za_z8F2tdt7D9efXhqrcDAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://th.bing.com/th/id/R.8917a777357dde5aed49aa53d6d6dd04?rik=35WKb7CufuuLDw&pid=ImgRaw&r=0",
      "https://tse4.mm.bing.net/th/id/OIP.3X_kI-DlMjob2PBa39SQLAHaFq?r=0&w=600&h=459&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://esalaperahera.com/wp-content/uploads/2026/04/Kandy-MPH-03.webp",
      "https://tse1.mm.bing.net/th/id/OIF.hqSIktyfWfGyI82nK7vY3g?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  nuwara_eliya: {
    title: "Nuwara Eliya",
    subtitle: "Little England, cool climate & rolling tea gardens",
    image: "https://tse1.mm.bing.net/th/id/OIP.f05D5rP_EfnsPkdOBPQjUQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: "4.8 (2.1k reviews)",
    bestTime: "2 Days",
    entryFeeText: "LKR 1,500",
    distance: "2 km",
    about: "Nuwara Eliya, famously known as Little England, is one of Sri Lanka's most beautiful hill-country destinations. It is famous for its cool climate, green tea plantations, misty mountains, colourful flower gardens and charming colonial architecture. Located in the Central province, Nuwara Eliya offers a peaceful escape from busy city life. Visitors can enjoy scenic landscapes, explore beautiful waterfalls, experience traditional tea production and discover the unique charm of Sri Lanka's highlands. With its refreshing mountain atmosphere and breathtaking natural beauty, Nuwara Eliya is a perfect destination for nature lovers, couples, families and adventure seekers.",
    highlights: ["Horton Plains & World's End", "Gregory Lake Activities", "Pedro Tea Factory", "Victoria Park"],
    thingsToDo: ["Hike Horton Plains", "Boating at Gregory Lake", "Tea Factory Tour & Tasting", "Stroll through Victoria Park"],
    mapQuery: "Nuwara Eliya Sri Lanka",
    gallery: [
      "https://tse1.mm.bing.net/th/id/OIP.bI-NlTTEA0BlVZI_bsPjEgHaFj?r=0&w=1024&h=768&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.TlMCgbHoulti_XDh9uIaZAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://www.srilankanroadtrip.com/exp/img/exp/the-pekoe-trail-stage-12/the-pekoe-trail-stage-12-1.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.QP-zhW4uY-BESvtivNi7KgHaFS?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://d27k8xmh3cuzik.cloudfront.net/wp-content/uploads/2018/10/shutterstock_11416168821.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.wxc7pKWHJ8bbCLiq7g7NyQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.DKQaBa4vkevgQRoesaM0AgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.bPKEBfBJWcKyI_jwM-xlEQHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.ANOm9O1TFAzVotmsi447BAHaHa?r=0&w=1080&h=1080&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.iOM7oOOF1v3STF5czH2B1AHaFF?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  mirissa: {
    title: "Mirissa",
    subtitle: "Golden beaches, surfing & whale watching",
    image: "/images/miris.jpg",
    rating: "4.8 (2.9k reviews)",
    bestTime: "2 Days",
    entryFeeText: "Free Entry",
    distance: "1 km",
    about: "Mirissa is one of Sri Lanka's most beautiful tropical beach destinations, famous for its golden sandy beaches, turquoise ocean waters, coconut palm landscapes and exciting whale-watching experiences. Located along the southern coast of Sri Lanka, Mirissa is a perfect destination for beach lovers, couples, adventure seekers and nature enthusiasts. Visitors can enjoy relaxing beach days, explore hidden coastal spots and experience the incredible marine life of the Indian Ocean. With its beautiful sunsets, fresh seafood restaurants and relaxing tropical atmosphere, Mirissa offers an unforgettable coastal holiday experience.",
    highlights: ["Coconut Tree Hill", "Secret Beach", "Whale Watching Hub", "Mirissa Crescent Beach"],
    thingsToDo: ["Go Whale Watching Boat Tour", "Photograph Coconut Tree Hill", "Surfing at Mirissa Beach", "Relax at Beachside Cafes"],
    mapQuery: "Mirissa Beach Sri Lanka",
    gallery: [
      "https://tse2.mm.bing.net/th/id/OIP.Kn6MyzNlhX8PuYc0o8zxSwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.DTgJV-EyBQdlcHW2GSARUwHaF4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.bOjnghZIt_eEO94Kr2ZsWwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.gAPuiNRDIeVDiP3DYRQ0KQHaEI?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/ee/42/bf.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.RMK9PfDcU0wbP0b9ra4e6AHaFj?r=0&w=640&h=480&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.Rj-_IwP2TDvGCYd4mzI1WwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.1-AxlhEYNlQe_NNpINZ6mQHaGV?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.pUSwCavxqityEb5BXbTiywHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://yalu.travel/content/images/2026/02/whale-watching-in-mirissa-a-seasonal-guide-feature.jpg"
    ]
  },
  yala_national_park: {
    title: "Yala National Park",
    subtitle: "Premier wildlife safari & leopard sanctuary",
    image: "/images/yalao.jpg",
    rating: "4.9 (3.4k reviews)",
    bestTime: "1 Day",
    entryFeeText: "LKR 6,000",
    distance: "15 km",
    about: "Yala National Park is one of Sri Lanka's most famous wildlife destinations, offering an unforgettable safari experience through natural forests, grasslands, lagoons and coastal landscapes. Located in the southeastern part of Sri Lanka, it is renowned for having a high density of leopards and rich biodiversity. It is also home to elephants, sloth bears, crocodiles, spotted deer, wild buffalo and hundreds of bird species. Visitors can explore the wilderness through exciting jeep safaris, observe wild animals in their natural habitats and enjoy the breathtaking beauty of Sri Lanka's untouched landscapes. Yala is an ideal destination for wildlife lovers, photographers, nature enthusiasts and adventure seekers.",
    highlights: ["High Leopard Density", "Wild Asian Elephants", "Block 1 Safari Zone", "Diverse Bird Species"],
    thingsToDo: ["Jeep Safari Game Drive", "Wildlife Photography", "Bird Watching", "Camping near Park Border"],
    mapQuery: "Yala National Park Sri Lanka",
    gallery: [
      "https://tse3.mm.bing.net/th/id/OIP.DKBreteOcVWpRr-CHqhsQgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.-HQRiNBnz8z9Mn69_HqtywHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.d3DlzEYtev5Q_osm0qdeNAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.I_NEIBW3FGpbX6ie7x4vpQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.fmTGz4iVriNwjneKdGGGMAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.tGVFe_RQPdKhyhxGGJ-7LAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://th.bing.com/th/id/R.63cc0c6ce5ea3aadfe32785084932fa8?rik=6sncVIdr9RrDyQ&riu=http%3a%2f%2fwww.srilankantours.org%2fuploads%2f8%2f4%2f9%2f7%2f8497630%2f__6992609_orig.jpg&ehk=mcZSWsPO%2f2oxniqgVmN3aEIaTdV6qEOa6bH20lS9y6g%3d&risl=&pid=ImgRaw&r=0",
      "https://tse3.mm.bing.net/th/id/OIP.u_j6fzbn61mf5kpu-GYtTwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://www.lankatourexperts.com/wp-content/uploads/2019/01/yala-safari-srilanka-economy-tours.jpg",
      "https://tse1.explicit.bing.net/th/id/OIP.oRq-Tut7wu3keZN9YLYUswHaHa?r=0&w=700&h=700&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  colombo: {
    title: "Colombo",
    subtitle: "Vibrant commercial capital & oceanfront skyline",
    image: "https://www.swedishnomad.com/wp-content/images/2020/08/Things-to-do-in-Colombo.jpg",
    rating: "4.6 (1.9k reviews)",
    bestTime: "1-2 Days",
    entryFeeText: "Free Entry",
    distance: "0 km",
    about: "Colombo is Sri Lanka's vibrant commercial capital, famous for its modern skyline, historic colonial architecture, colorful markets, beautiful religious landmarks and exciting city lifestyle. Located on the western coast of Sri Lanka, Colombo offers a unique combination of traditional Sri Lankan culture and modern urban experiences. Visitors can explore ancient temples, discover busy shopping streets, enjoy delicious local street food, visit museums and relax along the beautiful Indian Ocean coastline. From the iconic Lotus Tower to the peaceful surroundings of Beira Lake and the lively atmosphere of Galle Face Green, Colombo offers something for every traveller.",
    highlights: ["Galle Face Green Sunset", "Pettah Floating Market & Bazaars", "Lotus Tower Skyline", "Gangaramaya Temple"],
    thingsToDo: ["Street Food Tour at Galle Face", "Shopping in Pettah", "Visit Gangaramaya Temple", "Stroll Independence Square"],
    mapQuery: "Colombo Sri Lanka",
    gallery: [
      "https://tse4.mm.bing.net/th/id/OIP.ow6YLi1Pqn0yLO1tmdEi6QHaHa?r=0&w=580&h=580&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.qOXuqMioFPm2KOHnd1rk2wHaD4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.jC1oztiBaaji97GVXU4MOgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://images.ctfassets.net/bth3mlrehms2/6XJK0rllZi6qcm99jw5hDq/c9f29f46a73f58c55c92a95ac4467168/iStock-185069649.jpg?w=2121&h=1193&fl=progressive&q=50&fm=jpg",
      "https://tse2.mm.bing.net/th/id/OIP.Cqf6cujESEAeCOsweQggrwHaEq?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.sZEVRB5u0j2ECie9LmC3HgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://www.yogawinetravel.com/wp-content/uploads/2018/05/Colombo-Sri-Lanka-Skyline-Drone-Shot-Feature-2.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.p8g8AY4ULpUjQmzghF6LLwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.9fbdnhBUA5kTzQ5IUhj1UAHaEz?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse2.mm.bing.net/th/id/OIP.VTOgpmbYruOc5EOLcGX6LQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  },
  arugam_bay: {
    title: "Arugam Bay",
    subtitle: "World-renowned surf point & laid-back east coast",
    image: "https://tse2.mm.bing.net/th/id/OIP.eGmMnIkQz3xK4e2cbHMwZAHaDt?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: "4.8 (2.2k reviews)",
    bestTime: "2-3 Days",
    entryFeeText: "Free Entry",
    distance: "3 km",
    about: "Arugam Bay is one of Sri Lanka's most popular beach and surfing destinations, famous for its beautiful golden beaches, world-class surf breakers, tropical landscapes and relaxed coastal atmosphere. Located on the southeastern coast of Sri Lanka, Arugam Bay attracts surfers and international travellers from around the world. Its warm ocean waters, palm-lined beaches and exciting outdoor activities make it a perfect destination for beach lovers, adventure seekers and nature enthusiasts. Beyond surfing, visitors can explore hidden coastal viewpoints, enjoy lagoon boat safaris, discover nearby wildlife reserves and experience the peaceful beauty of Sri Lanka's eastern coastline.",
    highlights: ["Main Point Surf Break", "Pottuvil Lagoon Safari", "Elephant Rock Viewpoint", "Vibrant Beach Culture"],
    thingsToDo: ["Surfing Lessons & Sessions", "Lagoon Boat Safari", "Sunset at Elephant Rock", "Beach Parties & Dining"],
    mapQuery: "Arugam Bay Sri Lanka",
    gallery: [
      "https://tse2.mm.bing.net/th/id/OIP.TWMfLCEg3AMUREukwgI9mwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse4.mm.bing.net/th/id/OIP.BWAznK0QoiIfxkfcsIRpyQHaJQ?r=0&w=899&h=1124&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.ScCpVsRWc62WkIXA3fgDVQHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.xULV_QSLDPExopAhvt9dfQHaDt?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://srilankawonders.com/wp-content/uploads/2023/07/arugam-bay.png",
      "https://tse1.mm.bing.net/th/id/OIP.oSpXp_0xIHxN8_672rIwlgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.dJKqmojYsFS3mA05rnyJewHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.uEhkNvWjLGjH3PTKz2ahjwHaDt?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse1.mm.bing.net/th/id/OIP.aryeeHc9sEZz_9ZIDE2ImwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.o-0LXaQx0qkC_l7rMFEkBgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]
  }
};

export default function PlaceDetail() {
  const [searchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const placeKey = (searchParams.get("place") || "sigiriya").toLowerCase().replace(/\s+/g, "_");
  const place = placesData[placeKey] || placesData.sigiriya;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const screenEl = document.querySelector('.screen');
    if (screenEl) {
      screenEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [placeKey]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(place.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const allOtherDestinations = Object.entries(placesData)
    .filter(([key]) => key !== placeKey)
    .map(([key, data]) => ({
      key,
      title: data.title,
      image: data.image,
      subtitle: data.subtitle
    }));

  // Supabase Database Handler & Safe EmailJS Confirmation for Newsletter Subscription
  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberName.trim() || !subscriberEmail.trim()) {
      alert('Please enter both your name and email.');
      return;
    }

    setSubscribing(true);
    try {
      // 1. Save subscriber data to Supabase Database
      const { error } = await supabase
        .from('subscribers')
        .insert([{ name: subscriberName.trim(), email: subscriberEmail.trim() }]);

      if (error) {
        if (error.code === '23505') {
          alert('This email address is already subscribed to Lanka Stay!');
        } else {
          alert('Subscription failed: ' + error.message);
        }
      } else {
        // 2. Try sending confirmation email via EmailJS (safely wrapped so it won't crash if placeholders are not set)
        try {
          if (typeof emailjs !== 'undefined') {
            await emailjs.send(
              'YOUR_SERVICE_ID',
              'YOUR_TEMPLATE_ID',
              {
                to_name: subscriberName.trim(),
                to_email: subscriberEmail.trim(),
                message: 'Thank you for subscribing to Lanka Stay! You will now receive exclusive travel tips, destination updates, and special offers. Your journey, our care.'
              },
              'YOUR_PUBLIC_KEY'
            );
          }
          alert('Successfully subscribed to Lanka Stay!');
        } catch (emailErr) {
          console.warn('EmailJS note: Configure your service ID, template ID, and public key to enable automatic emails.', emailErr);
          alert('Successfully subscribed to Lanka Stay!');
        }

        setSubscriberName('');
        setSubscriberEmail('');
      }
    } catch (err) {
      alert('An unexpected error occurred: ' + (err?.message || err));
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <main className="screen place-detail-box-page">
      {/* Force sharp rectangular box corners and crystal-clear image without any blur/haze */}
      <style>{`
        .place-detail-box-page,
        .place-detail-box-page .loc-hero,
        .place-detail-box-page .loc-hero-overlay,
        .place-detail-box-page .loc-stats-bar,
        .place-detail-box-page .loc-section {
          border-radius: 0px !important;
          border-top-left-radius: 0px !important;
          border-top-right-radius: 0px !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
        }
        .place-detail-box-page .loc-hero {
          filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .place-detail-box-page .loc-hero::before,
        .place-detail-box-page .loc-hero::after {
          display: none !important;
          filter: none !important;
          backdrop-filter: none !important;
        }
        .place-detail-box-page .loc-hero-overlay {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          filter: none !important;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 100%) !important;
        }
      `}</style>

      {/* Hero Header - Sharp rectangular box & crystal clear image */}
      <header 
        className="loc-hero" 
        style={{ 
          backgroundImage: `url('${place.image}')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          width: '100%', 
          margin: 0 
        }}
      >
        <div className="loc-hero-overlay" style={{ width: '100%' }}>
          <nav className="loc-top-nav">
            <Link to={-1} className="loc-icon-btn"><i className="fa-solid fa-arrow-left"></i></Link>
            <button className="loc-icon-btn" onClick={(e) => e.currentTarget.classList.toggle('saved')}><i className="fa-regular fa-heart"></i></button>
          </nav>
          <div className="loc-hero-content">
            <div className="loc-rating-badge"><i className="fa-solid fa-star"></i> <span>{place.rating}</span></div>
            <h1 className="loc-title-text">{place.title}</h1>
            <p className="loc-subtitle-text">{place.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="loc-container" style={{ borderRadius: '0px' }}>
        <div className="loc-stats-bar">
          <div className="loc-stat-item"><i className="fa-regular fa-clock"></i><span>Best Time</span><strong>{place.bestTime}</strong></div>
          <div className="loc-stat-item"><i className="fa-solid fa-ticket"></i><span>Entry Fee</span><strong>{place.entryFeeText}</strong></div>
          <div className="loc-stat-item"><i className="fa-solid fa-location-dot"></i><span>From City</span><strong>{place.distance}</strong></div>
        </div>

        {/* 1. Destination Overview Card */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Destination Overview</h2>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4b5563' }}>{place.about}</p>
        </section>

        {/* Plan My Trip Button */}
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <Link 
            to={`/planner?destination=${placeKey}`} 
            className="ai-action-btn" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%', 
              padding: '14px', 
              borderRadius: '0px', 
              fontSize: '1rem', 
              fontWeight: '600',
              textDecoration: 'none',
              background: '#0f172a',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
          >
            <i className="fa-solid fa-route" style={{ marginRight: '8px' }}></i> Plan My Trip to {place.title}
          </Link>
        </div>

        {/* 2. Key Highlight Card */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Key Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {place.highlights.map((highlight, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '0px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '500', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-check-circle" style={{ color: '#D4AF37' }}></i>
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Photo Gallery Card (10 Photos with Clickable Lightbox) */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Photo Gallery</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>Click any photo to view full size</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} className="gallery-grid">
            {place.gallery.map((photoUrl, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(photoUrl)}
                style={{ 
                  borderRadius: '0px', 
                  overflow: 'hidden', 
                  height: '110px', 
                  cursor: 'pointer', 
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}
              >
                <img 
                  src={photoUrl} 
                  alt={`${place.title} ${idx + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0px' }} 
                />
              </div>
            ))}
          </div>
        </section>

        {/* Lightbox Modal for Photo Zoom */}
        {selectedImage && (
          <div 
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
              <span 
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '0',
                  color: '#fff',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                &times;
              </span>
              <img 
                src={selectedImage} 
                alt="Enlarged View" 
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '0px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} 
              />
            </div>
          </div>
        )}

        {/* 4. Top Things to Do Card */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Top Things to Do</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {place.thingsToDo.map((thing, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155', background: '#f8fafc', padding: '10px 14px', borderRadius: '0px' }}>
                <i className="fa-solid fa-compass" style={{ color: '#0f172a' }}></i>
                <span>{thing}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Location Card (Live Embedded Map & Directions Link) */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Location &amp; Map</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>View the interactive map below or click the button to open Google Maps for turn-by-turn directions.</p>
          
          <div style={{ width: '100%', height: '220px', borderRadius: '0px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
            <iframe
              title={`${place.title} Map`}
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0f172a', color: '#fff', padding: '12px', borderRadius: '0px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
          >
            <i className="fa-solid fa-map-location-dot" style={{ color: '#D4AF37' }}></i> Open in Google Maps
          </a>
        </section>

        {/* 6. Quick Information Card */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Quick Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '0px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Recommended Duration</span>
              <strong style={{ color: '#0f172a' }}>{place.bestTime}</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '0px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Approx. Entry Fee</span>
              <strong style={{ color: '#0f172a' }}>{place.entryFeeText}</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '0px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Rating &amp; Reviews</span>
              <strong style={{ color: '#0f172a' }}>{place.rating}</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '0px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Distance from Hub</span>
              <strong style={{ color: '#0f172a' }}>{place.distance}</strong>
            </div>
          </div>
        </section>

        {/* 7. Other Destinations Card (Shows ALL other destinations) */}
        <section className="loc-section" style={{ background: '#fff', padding: '20px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="loc-section-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Other Destinations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {allOtherDestinations.map((dest) => (
              <Link 
                key={dest.key} 
                to={`/place-detail?place=${dest.key}`} 
                onClick={scrollToTop}
                style={{ textDecoration: 'none', background: '#f8fafc', borderRadius: '0px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
              >
                <img src={dest.image} alt={dest.title} style={{ width: '100%', height: '95px', objectFit: 'cover', borderRadius: '0px' }} />
                <div style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#0f172a', marginBottom: '3px' }}>{dest.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {dest.subtitle}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="app-footer" style={{ marginBottom: 0, paddingBottom: '20px' }}>
        <div className="fotter-brand-section">
          <div className="footer-logo">
            <i className="fa-solid fa-umbrella-beach logo-icon-gold"></i>
            <div className="logo-text">
              <h2>LANKA STAY</h2>
              <small>YOUR JOURNEY, OUR CARE</small>
            </div>
          </div>
          <p className="footer-about-text">
            <strong>LANKA Stay</strong><span data-i18n="fd1"> - operated by LankaGo (Pvt) Ltd and incorporated under companies Act No. 7 0f 2026 (company Registration no. PV00345889) - is your trusted Sri Lanka travel partner, dedicated to crafting tailor-made journeys, authentic experiences, cultural immersion, and exceptional comfort.</span>
          </p>

          <p className="footer-about-text"><span data-i18n="fd2">
            We bring your travel dreams to life through expertly curated itineraries, genuine local insights, and personalized service every step of the way - <em>Because your journey our care.</em>
          </span></p>

          <div className="footer-social-icons">
            <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
            <a href="#"><i className="fa-brands fa-pinterest-p"></i></a>
            <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-tiktok"></i></a>
          </div>

          <div className="footer-partner-badge">
            <span className="badge-tag">PARTNERED ON SOCIAL MEDIA</span>
            <div className="partner-box-content">
              <div className="partner-logo-title">Pick Me</div>
              <div className="partner-sub">Official Travel Media Partner</div>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-block">
          <h3 className="footer-heading"><span data-i18n="lh">QUICK LINKS</span></h3>
          <ul className="footer-nav-list">
            <li><a href="#"><span data-i18n="l1">Home</span></a></li>
            <li><a href="#"><span data-i18n="l2">Travel Testimonials</span></a></li>
            <li><a href="#"><span data-i18n="l3">Tour Package</span></a></li>
            <li><a href="#"><span data-i18n="l4">Day Tours</span></a></li>
            <li><a href="#"><span data-i18n="l5">Destinations</span></a></li>
            <li><a href="#"><span data-i18n="l6">Tailor Made Tours</span></a></li>
            <li><a href="#"><span data-i18n="l7">MICE &amp; Corporate Travel</span></a></li>
            <li><a href="#"><span data-i18n="l8">Blog</span></a></li>
            <li><a href="#"><span data-i18n="l9">Careers</span></a></li>
            <li><a href="#"><span data-i18n="l10">Our Partners</span></a></li>
            <li><a href="#"><span data-i18n="l11">pay-fee-PVT-Ltd</span></a></li>
            <li><a href="#"><span data-i18n="l12">Faq</span></a></li>
            <li><a href="#"><span data-i18n="l13">About Us</span></a></li>
            <li><a href="#"><span data-i18n="l14">Contact Us</span></a></li>
            <li><a href="#"><span data-i18n="l15">Rate Us</span></a></li>
          </ul>
        </div>

        <hr className="footer-divider" />

        <div className="footer-block">
          <h3 className="footer-heading"><span data-i18n="destinations">DESTINATIONS</span></h3>
          <ul className="footer-nav-list">
            <li><a href="#"><span data-i18n="sigiriya">Sigiriya</span></a></li>
            <li><a href="#"><span data-i18n="kandy">Kandy</span></a></li>
            <li><a href="#"><span data-i18n="ella">Ella</span></a></li>
            <li><a href="#"><span data-i18n="nuwara_eliya">Nuwara Eliya</span></a></li>
            <li><a href="#"><span data-i18n="mirissa">Mirissa</span></a></li>
            <li><a href="#"><span data-i18n="galle">Galle</span></a></li>
            <li><a href="#"><span data-i18n="yala_national_park">Yala National Park</span></a></li>
            <li><a href="#"><span data-i18n="colombo">Colombo</span></a></li>
            <li><a href="#"><span data-i18n="arugam_bay">Arugam Bay</span></a></li>
          </ul>
        </div>

        <div className="footer-block">
          <h3 className="footer-heading">BROWSE SRI LANKA TOURS</h3>
          <div className="footer-tags-wrapper">
            <a href="#" className="tour-chip">Wildlife Safaris</a>
            <a href="#" className="tour-chip">Honeymoon Packages</a>
            <a href="#" className="tour-chip">Luxury Packages</a>
            <a href="#" className="tour-chip">Family Trips</a>
            <a href="#" className="tour-chip">Ayurveda &amp; Wellness</a>
            <a href="#" className="tour-chip">Cultural Tours</a>
            <a href="#" className="tour-chip">Heritage &amp; History</a>
            <a href="#" className="tour-chip">Beach holidays</a>
            <a href="#" className="tour-chip">Adventure Tours</a>
            <a href="#" className="tour-chip">Nature &amp; Hills</a>
            <a href="#" className="tour-chip">Private Transfers</a>
            <a href="#" className="tour-chip">Scenic Train Journeys</a>
            <a href="#" className="tour-chip">7 Days in Sri Lanka</a>
            <a href="#" className="tour-chip">10 Days in Sri Lanka</a>
            <a href="#" className="tour-chip">12 Days in Sri Lanka</a>
            <a href="#" className="tour-chip">14 Days in Sri Lanka</a>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-block">
          <h3 className="footer-heading">OUR OFFICE</h3>
          <ul className="footer-contact-list">
            <li>
              <i className="fa-solid fa-phone"></i>
              <span>Hotline: +94 85 345 3454</span>
            </li>
            <li>
              <i className="fa-solid fa-phone-volume"></i>
              <span>General: +94 11 478 6784</span>
            </li>
            <li>
              <i className="fa-solid fa-whatsapp"></i>
              <span>Chat On WhatsApp</span>
            </li>
            <li>
              <i className="fa-solid fa-envelope"></i>
              <span>info@lankastay.com</span>
            </li>
            <li>
              <i className="fa-solid fa-location-dot"></i>
              <span>Lanka Stay (Pvt) Ltd, No. 105/A1, Western Province, Colombo3, Sri Lanka</span>
            </li>
          </ul>
        </div>

        <div className="footer-newsletter-card">
          <h3 className="newsletter-sub">Subscribe to receive travel tips and exclusive offers.</h3>
          <form className="newsletter-form" onSubmit={handleSubscribeSubmit}>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={subscriberName} 
              onChange={(e) => setSubscriberName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={subscriberEmail} 
              onChange={(e) => setSubscriberEmail(e.target.value)} 
              required 
            />
            <button type="submit" disabled={subscribing}>
              {subscribing ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>
        </div>

        <div className="footer-legal">
          <p>&copy; 2026 <strong>Lanka Stay (Pvt) Ltd</strong>. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a> &bull;
            <a href="#">Terms and Conditions</a> &bull;
            <a href="#">Cookie Policy</a> &bull;
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
