import Catalog from "./catalog.js";

new Catalog().getImage(1073690).then((image) => {
    console.log(image);
});