window.CATALOG_COLLECTION_MEDIA = (function () {
  "use strict";

  const media = window.CATALOG_MEDIA.find(function (product) {
    return product.id === "biquini-marquinha-fita";
  });
  if (!media) {
    throw new Error("Os dados de mídia do Biquíni Marquinha de Fita não foram carregados.");
  }

  const marquinhaImages = [
    "images/colecao-marquinha-de-fita/roxo-1.jpeg",
    "images/colecao-marquinha-de-fita/roxo-3.jpeg",
    "images/colecao-marquinha-de-fita/azul-2.jpeg",
    "images/colecao-marquinha-de-fita/azul-5_mini.jpeg",
    "images/colecao-marquinha-de-fita/laranja-3.jpeg",
    "images/colecao-marquinha-de-fita/laranja-4_mini.jpeg",
    "images/colecao-marquinha-de-fita/rosa-neon-1.jpeg",
    "images/colecao-marquinha-de-fita/rosa-neon-2.jpeg",
    "images/colecao-marquinha-de-fita/rosa-bebe-1.jpeg",
    "images/colecao-marquinha-de-fita/rosa-bebe-4_mini.jpeg",
    "images/colecao-marquinha-de-fita/preto-1.jpeg",
    "images/colecao-marquinha-de-fita/preto-4_mini.jpeg",
    "images/colecao-marquinha-de-fita/oncinha-1.jpg",
    "images/colecao-marquinha-de-fita/oncinha-2.jpg"
  ];
  const bicolorImages = [
    "images/colecao-marquinha-de-fita/bicolor-verde-1.jpeg",
    "images/colecao-marquinha-de-fita/bicolor-verde-2.jpeg",
    "images/colecao-marquinha-de-fita/bicolor-verde-3.jpeg",
    "images/colecao-marquinha-de-fita/bicolor-vermelho-1.jpeg",
    "images/colecao-marquinha-de-fita/bicolor-vermelho-3_mini.jpeg"
  ];

  media.platformId = "local-marquinha-de-fita";
  media.images = marquinhaImages;
  media.colors = ["Roxo", "Azul", "Laranja", "Rosa Neon", "Rosa Bebê", "Preto", "Estampa Oncinha"];
  media.sizes = ["P", "M", "G"];
  media.colorSpecificGalleries = true;
  media.colorImages = [
    { color: "Roxo", images: marquinhaImages.slice(0, 2) },
    { color: "Azul", images: marquinhaImages.slice(2, 4) },
    { color: "Laranja", images: marquinhaImages.slice(4, 6) },
    { color: "Rosa Neon", images: marquinhaImages.slice(6, 8) },
    { color: "Rosa Bebê", images: marquinhaImages.slice(8, 10) },
    { color: "Preto", images: marquinhaImages.slice(10, 12) },
    { color: "Estampa Oncinha", images: marquinhaImages.slice(12, 14) }
  ];
  media.variants = [];

  return [
    {
      id: "biquini-fita-bicolor",
      platformId: "local-fita-bicolor",
      images: bicolorImages,
      colors: ["Verde com Preto", "Vermelho com Preto"],
      sizes: ["P", "M", "G"],
      colorSpecificGalleries: true,
      colorImages: [
        { color: "Verde com Preto", images: bicolorImages.slice(0, 3) },
        { color: "Vermelho com Preto", images: bicolorImages.slice(3, 5) }
      ],
      variants: []
    }
  ];
})();

window.CATALOG_MEDIA.push.apply(window.CATALOG_MEDIA, window.CATALOG_COLLECTION_MEDIA);
