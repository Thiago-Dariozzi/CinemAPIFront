export const initialForm = {
    title: "",
    synopsis: "",
    durationMinutes: 0,
    genreId: "",
    imageUrl: "",
    isActive: false,
    // Opcional: precio "sugerido" de catálogo, precarga el precio al armar una función
    // nueva para esta película (Movie.SuggestedPrice). Se maneja como string vacío/número
    // igual que el resto de los inputs numéricos del form.
    suggestedPrice: ""
};