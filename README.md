# Dokumentacja kontraktu OrderContract

## Wstęp

OrderContract jest kontraktem inteligentnym opartym na Ethereum, który obsługuje system zamówień dla platformy e-commerce. Użytkownicy mogą tworzyć zamówienia, aktualizować statusy zamówień i odczytywać informacje o swoich zamówieniach. Właściciel kontraktu może również mianować administratorów, którzy mają uprawnienia do aktualizacji statusów zamówień.

## Instalacja

Do wdrażania i interakcji z tym kontraktem potrzebujesz środowiska Node.js oraz pakietów `hardhat` i `@openzeppelin/contracts` oraz innych. 

Zainstaluj te zależności za pomocą Yarn:

```bash
yarn install
```

## Funkcje kontraktu

### `createOrder(string memory _product, uint256 _price) public`

Tworzy nowe zamówienie. `_product` to nazwa produktu, a `_price` to cena w wei. Numer ID zamówienia jest automatycznie generowany.

### `getOrder(uint256 _id) public view returns (Order memory)`

Zwraca obiekt zamówienia dla danego ID. `_id` to identyfikator zamówienia.

### `updateOrderStatus(uint256 _id, string memory _status) public onlyBuyerOrOwnerOrAdmin(_id)`

Aktualizuje status zamówienia. `_id` to identyfikator zamówienia, a `_status` to nowy status. Ta funkcja jest dostępna tylko dla właściciela zamówienia, właściciela kontraktu lub administratora.

### `getBuyerOrders(address _buyer) public view returns (uint256[] memory)`

Zwraca listę identyfikatorów zamówień dla danego kupującego. `_buyer` to adres kupującego.

### `setAdmin(address _admin, bool _status) public onlyOwner`

Ustawia lub usuwa status administratora dla danego adresu. `_admin` to adres użytkownika, a `_status` to wartość boolowska określająca, czy użytkownik ma być administratorem. Ta funkcja jest dostępna tylko dla właściciela kontraktu.


## Wdrażanie kontraktu

Aby wdrożyć kontrakt na sieci Ethereum, musisz skonfigurować odpowiednie zmienne środowiskowe w pliku `.env`. Do tego celu dostarczamy plik `.env_example`, który pokazuje, jakie zmienne są potrzebne.

Poniżej znajduje się opis tych zmiennych:

- `DEV_PRIVATE_KEY`: Prywatny klucz do konta Ethereum, które będzie używane do wdrażania kontraktu na sieci testowej (np. Goerli).
- `PROD_PRIVATE_KEY`: Prywatny klucz do konta Ethereum, które będzie używane do wdrażania kontraktu na sieci głównej (mainnet).
- `DEV_RPC_GOREELI`: URL do Ethereum JSON RPC dla sieci testowej Goerli. Można go uzyskać, rejestrując się na portalach takich jak Infura czy Alchemy.
- `PROD_RPC_ETH`: URL do Ethereum JSON RPC dla sieci głównej (mainnet). Podobnie jak powyżej, można go uzyskać z Infura, Alchemy itp.
- `ETHERSCAN_API_KEY`: Klucz API do Etherscan, który jest używany do weryfikacji kodu źródłowego kontraktu na Etherscan po wdrożeniu.

Po skonfigurowaniu pliku `.env`, możesz uruchomić skrypt `deploy.js` za pomocą narzędzia Hardhat:

```bash
npx hardhat run scripts/deploy.js --network <nazwa_sieci>
```

Możesz użyć `eth` lub `goerli` jako `<nazwa_sieci>` w zależności od sieci, na której chcesz wdrożyć kontrakt.

Ten skrypt wdroży kontrakt do wybranej sieci Ethereum i wyświetli adres kontraktu.

## Weryfikacja kontraktu

Weryfikacja kontraktu polega na publikacji kodu źródłowego kontraktu na Etherscan. Dzięki temu inni użytkownicy mogą zweryfikować i zrozumieć funkcje kontraktu. Poniżej znajduje się instrukcja, jak to zrobić:

1. Pierwszym krokiem jest skompilowanie kontraktu przy użyciu Hardhat:

   ```
   npx hardhat compile
   ```

2. Następnie musisz wdrożyć kontrakt na sieci Ethereum (Mainnet lub testnet). Pamiętaj, aby przechować adres kontraktu, który otrzymasz po wdrożeniu.

3. Teraz musisz zweryfikować kontrakt na Etherscan. Aby to zrobić, potrzebujesz klucza API Etherscan, który można uzyskać, tworząc konto na Etherscan. Klucz API należy dodać do pliku `.env`.

   ```
   ETHERSCAN_API_KEY=YourEtherscanApiKey
   ```

4. Następnie, za pomocą Hardhat, możemy zweryfikować kontrakt na Etherscan za pomocą następującego polecenia:

   ```
   npx hardhat verify --network {network-name} {contract-address}
   ```

   Zamień `{network-name}` na nazwę sieci, na której wdrożyłeś kontrakt, a `{contract-address}` na adres kontraktu.

Po zakończeniu procesu weryfikacji, Twój kod źródłowy kontraktu będzie publicznie dostępny na stronie Etherscan pod adresem kontraktu. Pamiętaj, że weryfikacja kontraktu jest opcjonalna, ale zdecydowanie zalecana, ponieważ zwiększa transparentność i zaufanie do Twojego kontraktu.

## Interakcja z kontraktem

Po wdrożeniu kontraktu, będziesz chciał/a z nim interakcować. Możesz to zrobić na wiele sposobów, ale najpopularniejsze to korzystanie z interfejsu programowania aplikacji (API) ether.js lub web3.js. Ether.js jest wbudowane w narzędzie Hardhat, co ułatwia interakcję z kontraktem.

### Przykład interakcji z kontraktem za pomocą ether.js

1. Najpierw musisz zainicjalizować instancję ether.js i załadować kontrakt. Aby to zrobić, będziesz potrzebować adresu kontraktu oraz ABI kontraktu. ABI (Application Binary Interface) jest reprezentacją funkcji kontraktu i jest generowane podczas kompilacji kontraktu.

   ```javascript
   const provider = new ethers.providers.JsonRpcProvider();
   const contract = new ethers.Contract(contractAddress, contractABI, provider);
   ```

2. Teraz możesz wywoływać funkcje kontraktu. Na przykład, jeśli chcesz stworzyć nowe zamówienie, możesz to zrobić następująco:

   ```javascript
   const createOrderTx = await contract.createOrder("Product 1", ethers.utils.parseEther("1"));
   ```

   Zwróć uwagę, że musisz użyć prawidłowego adresu kontraktu i poprawnego ABI. Jeżeli wywołujesz funkcję, która zmienia stan kontraktu (tak jak `createOrder`), musisz to zrobić z podpisem transakcji (podpisując transakcję kluczem prywatnym).

3. Możesz także czytać dane z kontraktu. Na przykład, aby uzyskać informacje o zamówieniu, użyj funkcji `getOrder`:

   ```javascript
   const order = await contract.getOrder(1);
   console.log(order);
   ```

4. Pamiętaj, że interakcja z kontraktem wymaga etheru do pokrycia kosztów transakcji (gas). Dlatego musisz posiadać wystarczającą ilość etheru na swoim koncie.

Używając tych kroków, możesz interakcować z dowolnym kontraktem na łańcuchu Ethereum. Upewnij się, że znasz adres kontraktu, ABI i masz dostęp do konta z wystarczającą ilością etheru.