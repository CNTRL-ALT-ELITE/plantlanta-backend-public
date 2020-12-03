import ShopItemModel from "../../../MongoDB/ShopItem";

const createNewShopItem = async (parent, args, ctx, info) => {
  const { shopItem } = args;
  console.log(shopItem);
  const query = await ShopItemModel.create(shopItem);

  return query;
};

const updateExistingShopItem = async (parent, args, ctx, info) => {
  const { shopItem, id } = args;

  const query = await ShopItemModel.updateOne({ _id: id }, { $set: shopItem });

  return query.nModified > 0;
};

const removeExistingShopItem = async (parent, args, ctx, info) => {
  const { id } = args;

  const query = await ShopItemModel.remove({ _id: id }, { justOne: true });
  return query.deletedCount > 0;
};

const updateShopItemImage = async (parent, args, ctx, info) => {
  const { id, imageURL } = args;
  const query = await ShopItemModel.updateOne(
    { _id: id },
    { $set: { original_image_url: imageURL } }
  );

  return query.nModified > 0;
};

const getShopItems = async (parent, args, ctx, info) => {
  const getShopItems = await ShopItemModel.find();

  return getShopItems;
};

export default {
  Mutation: {
    createNewShopItem,
    updateExistingShopItem,
    removeExistingShopItem,
    updateShopItemImage
  },
  Query: {
    getShopItems
  }
};
