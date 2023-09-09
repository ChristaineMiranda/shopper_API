import repository from "../repositories";


function checkNewPriceRules(currentPrice: number, costPrice: number, newPrice: number) {
    const maxPrice: number = currentPrice * 1.1;
    const minPrice: number = currentPrice * 0.9;
    if (newPrice < costPrice) return "O preço de venda não pode ser abaixo do preço de custo";
    if (newPrice > maxPrice || newPrice < minPrice) return "O reajuste não pode ser maior ou menor do que 10% do preço atual do produto";
    return 'OK';
}

async function checkPackProdut(code: number, newPrice: number, list: number[][]) {
    const isPack = await repository.findByPackId(code);
    if (!isPack.length) return "Preço consistente";

    const foundComponents = [];

    for (const component of isPack) {
        const componentCode = Number(component.product_id);

        const matchingComponent = list.find(item => item[0] === componentCode);

        if (matchingComponent) {
            foundComponents.push({
                code: componentCode,
                price: matchingComponent[1]
            });
        }
    }

    let calculatedPackPrice = 0;

    for (const component of isPack) {
        const componentCode = Number(component.product_id);
        const foundComponent = foundComponents.find(item => item.code === componentCode);

        if (foundComponent) {
            calculatedPackPrice += foundComponent.price * Number(component.qty);
        }
        else {
            const currentPrice = await repository.findProductByCode(Number(component.pack_id))
            calculatedPackPrice += currentPrice.sales_price.toNumber() * Number(component.qty);
        }
    }

    if (calculatedPackPrice === newPrice) {
        return "Preço consistente";
    } else {
        return "Preço inconsistente";
    }
}

async function checkIsComponentOfPack(code: number, newPrice: number, currentProductPrice: number, list: number[][]) {
    const isComponent = await repository.findPackByProductId(code);
    if (!isComponent) return "OK";

    const packToUpdate = list.find((item) => item[0] === Number(isComponent.pack_id));
    if (!packToUpdate) return "O arquivo também deve conter um reajuste do preço do pacote";

    let calculatedPackPrice = 0

    const pack = await repository.findProductByCode(packToUpdate[0]);
    const currentPackPrice = pack.sales_price.toNumber();
    calculatedPackPrice = currentPackPrice - (currentProductPrice * Number(isComponent.qty)) + (newPrice * Number(isComponent.qty));
    calculatedPackPrice = Number(calculatedPackPrice.toFixed(2));

    if (calculatedPackPrice !== packToUpdate[1]) return "Valor inconsistente com o preço do pacote fornecido"


    return "OK";
}


async function validateChanges(updateList: number[][]) {


    const resultList = await Promise.all(updateList.map(async (item, index) => {

        const code = Number(item[0]);
        const newPrice = item[1];
        const modelResponse = { code: '', name: '', priceActual: '', priceNew: '' };
        if (item.length <= 1 && index === (updateList.length - 1)) {
            return modelResponse;
        }

        if (!code || isNaN(code) || isNaN(newPrice)) {
            return { ...modelResponse, code, newPrice, observation: 'Preenchimento incorreto' }
        }


        const productExists = await repository.findProductByCode(code);

        if (!productExists) return { ...modelResponse, code, newPrice, observation: 'Código ou produto inexistente' }

        const costPrice: number = productExists.cost_price.toNumber();
        const salesPrice: number = productExists.sales_price.toNumber();

        const consistentPrice = await checkPackProdut(code, newPrice, updateList);
        const isProductComponent = await checkIsComponentOfPack(code, newPrice, salesPrice, updateList);


        const response = { code, name: productExists.name, priceCurrent: salesPrice, newPrice }
        const consistentReadjustment: string = checkNewPriceRules(salesPrice, costPrice, newPrice);

        if (consistentPrice !== 'Preço inconsistente' && consistentReadjustment === 'OK' && isProductComponent === "OK") {
            return { ...response, allowed: true }
        }
        let observation = (consistentPrice || "");
        observation += " / " + consistentReadjustment;
        return { ...response, observation: observation, allowed: false }
    }));


    return resultList;

}



const service = {
    validateChanges,

};
export default service;