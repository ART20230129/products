// описание класса продукта
class Good {
        constructor(id, name, description, sizes, price, available){
        this.id = id;
        this.name = name;
        this.description = description;
        this.size = sizes;
        this.price = price;
        this.available = available;
        }
        setAvailable(isAvailable) {
                this.available = isAvailable; };
}


// объект Список Товаров
 class GoodsList {
        #goods = []; //скрытое извне свойство, которое будет содержать все товары типа Good
        constructor(filter, sortPrice=false, sortDir=false){
                this.filter = filter; //свойство, которому в процессе использования объекта типа GoodsList 
                                      // может быть присвоено значение регулярного выражения. 
                                      //Данное свойство может быть использовано прифильтрации товаров по имени.
                this.sortPrice = sortPrice;
                this.sortDir = sortDir;
        }

        get list(){
                let filterGoods = this.#goods.filter(good => good.available == true);//отфильтрованный по доступности товаров
                // фильтруем по имени, если задано регулярное выражение для свойства filter    
                if (this.filter){
                        filterGoods =  filterGoods.filter(good => new RegExp(this.filter, "i").test(good.name));  
                }
                if (this.sortPrice == true) {
                        if (this.sortDir == true) { //сортируем по возрастанию
                                return  filterGoods.sort((a, b) => a.price - b.price); 
                        } else { ////сортируем по убыванию
                                return filterGoods.sort((a,b) => b.price - a.price);
                        }
                }
                return filterGoods;
        }

        // метод, который добавляет товар в список (В случае наличия товара в списке переданный товар не добавлять)
        add(good){
                if (!this.#goods.includes(good.name)){
                        this.#goods.push(good);
                }            
        }
        // удаляет товар из списка. В качестве параметра метод принимает идентификатор товара. 
        //В случае наличия товара в списке товар необходимо удалить из списка.
        remove(id){
             for (let i = 0; i < this.#goods.lenght; i++){
                if (this.#goods[i].id === id) {
                        this.#goods.splice(i, 1);
                }
             }
            /*  let index = this.#goods.findIndex(good => good.id === id);
                if (index !== false){
                        this.#goods.splice(index, 1);
                }
           */
       }

}

//класс Товар в Корзине
class BasketGood extends Good {
        constructor(id, name, description, sizes, price, available, amount) {
            super(id, name, description, sizes, price, available,);
            this.amount = amount;
        }
}

//класс, описывающий корзину, в которой содержатся товары с количеством.
//При инициализации нового объекта Корзина через ключевое слово new в коструктор ничего не передавать
class Basket {
        constructor(goods) {
                this.goods = goods;
     }
//"геттер", который должен возвращать общее количество всех товаров в корзине
        get totalAmount(){
                return this.goods.reduce((accumulator, good) => accumulator + good.amount, 0); //если массив пуст, 
        }                                                                   //то без нуля может выдать ошибку

//"геттер", который должен возвращать общую стоимость всех товаров в корзине
        get totalSumm(){
                return this.goods.reduce((accumulator, good) => accumulator + good.price * good.amount, 0);
        }
  // метод, который добавляет новый товар типа BasketGood в корзину, если такого товара ещё нет в корзине, 
  //иначе увеличивается количество существующего товара в корзине      
        add (good, amount){
                const index = this.goods.findIndex(item => item.id == good.id);
                if(index >= 0) {
                        this.goods[index].amount += amount;
                } else {
                        let addGood = new BasketGood(good, amount);
                        this.goods.push(addGood);
                }
        }
// метод, который удаляет товар типа BasketGood из корзины, если значение amount больше 
// или равно количеству товаров в корзине. В противном случае метод уменьшает количество товаров в корзине.
        remove (good, amount){
                const index = this.goods.findIndex(item => item.id == good.id);
                if (index >= 0) {
                        if (amount >= this.goods[index].amount) {
                                this.goods[index].splice(index, 1);
                        } else {
                                this.goods[index].amount -= amount;
                        }
                }       
        }
// метод, который удаляет все товары из корзины.
        clear(){
                this.goods = this.goods.splice(0, this.goods.length)
        }

// метод, который удаляет недоступные товары (available === false)
        removeUnavailable(){
                this.goods = this.goods.filter(good => good.available !== false);
        }
}


