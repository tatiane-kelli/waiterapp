import { FlatList, Modal } from "react-native";
import { Product } from "../../types/Product";
import { FormatCurrency } from "../../utils/FormatCurrency";
import { Button } from "../Button";
import { Close } from "../Icons/Close";
import { Text } from "../Text";
import {
  Image,
  CloseButton,
  ModalBody,
  Header,
  IngredientsContainer,
  Ingredient,
  Footer,
  FooterContainer,
  PriceContainer} from "./styles";

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: null | Product;
  onAddToCart: (product: Product) => void;
}
export function ProductModal({visible, onClose, product, onAddToCart}: ProductModalProps) {
  if (!product) {
    return null;
  }

  function handleAddToCart(){
    onAddToCart(product!);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet" //works only at IOs
      onRequestClose={onClose}
    >
      <Image
        source={{
          uri: `http://192.168.1.120:3001/uploads/${product.imagePath}`,
        }}
      >
        <CloseButton onPress={onClose}>
          <Close />
        </CloseButton>
      </Image>
      <ModalBody>
        <Header>
          <Text weight="600" size={24}>{product.name}</Text>
          <Text
          color="#666666"
          style={{marginTop: 8}}>
            {product.description}
          </Text>
        </Header>
        {product.ingredients.length > 0 && (
          <IngredientsContainer>
          <Text weight="600" color="#666666">Ingredientes</Text>
          <FlatList
            style={{marginTop: 16}}
            data={product.ingredients}
            keyExtractor={ingredient => ingredient._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: ingredient}) => (
              <Ingredient>
                <Text>{ingredient.icon}</Text>
                <Text color="#666" size={14} style={{marginLeft: 20}}>
                  {ingredient.name}
                </Text>
              </Ingredient>
            )}
          />
        </IngredientsContainer>
        )}
      </ModalBody>
      <Footer>
        <FooterContainer>
          <PriceContainer>
            <Text color="#666">Preço</Text>
            <Text size={20} weight="600">{FormatCurrency(product.price)}</Text>
          </PriceContainer>
          <Button onPress={handleAddToCart}>
            Adicionar ao pedido
          </Button>
        </FooterContainer>
      </Footer>
    </Modal>
  );
}
