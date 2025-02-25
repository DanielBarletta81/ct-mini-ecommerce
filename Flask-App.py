from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

app = Flask(__name__)

# Set CORS headers for all routes
@app.after_request
def after_request(response):
      response.headers['Access-Control-Allow-Origin'] = '*'
      response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
      response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
      response.headers['Referrer-Policy'] = 'no-referrer-when-downgrade'
      return response

CORS(app, resources={r"/*": {
      "origins": "*",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allow_headers": ["Content-Type", "Authorization"]
}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Babinz2023!@localhost/e_commerce'
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Create schemas for models created above

class CustomerSchema(ma.Schema):
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True)

    class Meta:
              fields = ("name", "email", "phone", "id")
class CustomerAccountsSchema(ma.Schema):
          username = fields.String(required=True)
          password = fields.String(required=True)
          customer_id = fields.Integer()

      
class OrderSchema(ma.Schema):
          order_date = fields.Date(required=True)
          customer_id = fields.Integer()
          product_id = fields.Integer(required=True)

      
        

class ProductSchema(ma.Schema):
          name = fields.String(required=True)
          price = fields.Float(required=True)
        
       


customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many= True)

customer_account_schema= CustomerAccountsSchema()
customer_accounts_schema= CustomerAccountsSchema(many=True)


order_schema = OrderSchema()
orders_schema = OrderSchema(many= True)

product_schema = ProductSchema()
products_schema = ProductSchema(many= True)



# Define models for customers, accounts, orders, and products


class Customer(db.Model):
    __tablename__ = 'Customers'

    id = db.Column(db.Integer, primary_key = True)
    name= db.Column(db.String(255), nullable = False)
    email = db.Column(db.String(320))
    phone = db.Column(db.String(15))

    class Order(db.Model):
      __tablename__ = 'Orders' 

      id = db.Column(db.Integer, primary_key=True)
      order_date= db.Column(db.Date(), nullable=False)
      product_id = db.Column(db.Integer, db.ForeignKey('Products.id'))
      customer_id = db.Column(db.Integer, db.ForeignKey('Customers.id'))
    
 
class CustomerAccount(db.Model):
    __tablename__ = 'Customer_Accounts'

    id = db.Column(db.Integer, primary_key = True)
    username= db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable= False)
    customer_id = db.Column(db.Integer, db.ForeignKey('Customers.id'))
    customer = db.relationship('Customer', backref= 'customer_account', uselist= False)


    ###
    ### add order table here ###
order_product = db.Table("Order_Product",
      db.Column('order_id', db.Integer, db.ForeignKey('Orders.id'), primary_key = True),
      db.Column('product', db.Integer, db.ForeignKey('Products.id'), primary_key = True))


class Product(db.Model):
      __tablename__ = 'Products'   
      id = db.Column(db.Integer, primary_key = True)
      name= db.Column(db.String(255), nullable = False)
      price= db.Column(db.Float, nullable = False)
      orders = db.relationship('Order', secondary= order_product, backref= db.backref('products'))





#### Create Routes for e-commerce db ######

@app.route('/', methods =['GET'])

def home():
      return "Welcome to the E-Commerce Database!!"

#route to get all customers

@app.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return customers_schema.jsonify(customers)

@app.route('/customers/<int:id>', methods=['GET'])
def get_customer_details(id):
    customer = Customer.query.get(id)
    return customer_schema.jsonify(customer)

# route to add new customers

@app.route('/customers', methods=['POST'])
def add_a_customer():
   try:
     customer_data = customers_schema.load(request.json)
   except ValidationError as e:
     print(f'Validation Error: {e}')
     return jsonify(e.messages), 400

   new_customer = Customer(name = customer_data["name"], 
                           email = customer_data["email"], 
                           phone = customer_data["phone"])
   db.session.add(new_customer)
   db.session.commit()
       
   return jsonify({"message": "New customer added successfully"}), 201




####  Update Customer: Create an endpoint for updating customer details, 
###   allowing modifications to the customer's name, email, and phone number.

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer():
    customer = Customer.query.first_or_404()
    try:
    
        customer_data = customer_schema.load(request.json)
     #catch errors in input during update

    except ValidationError as e:
      
      return jsonify(e.messages), 400
    
    updated_customer = Customer(name = customer_data['name'],
                                email = customer_data['email'],
                                phone = customer_data['phone'])
  
    db.session.commit(updated_customer)

    return jsonify({"message": "Customer info updated successfully"}), 200

# Route to delete customer -------

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    
    customer = Customer.query.get(id)
    db.session.delete(customer)
    db.session.commit()
    
    return jsonify({"message": "Customer deleted successfully"}), 200



#### Routes for Customer Accounts #### ______________________________________

@app.route('/customer_accounts', methods=['GET'])

def get_accounts():
      customers_accounts = CustomerAccount.query.all()
      return  customer_accounts_schema.jsonify(customers_accounts)


@app.route('/customer_accounts', methods=['POST'])
def add_a_customer_account():
   try:
     customer_data = customer_account_schema.load(request.json)
   except ValidationError as e:
     print(f'Validation Error: {e}')
     return jsonify(e.messages), 400

   new_customer_account = CustomerAccount(username = customer_data["username"],
                                           password = customer_data["password"])
   db.session.add(new_customer_account)
   db.session.commit()
       
   return jsonify({"message": "New customer added successfully"}), 201

@app.route('/customer_accounts/<int:user_id>', methods=['PUT'])
def update_account(id):
    customer = CustomerAccount.query.get_or_404(id)
    try:
    
        customer_data = customer_account_schema.load(request.json)
     #catch errors in input during update

    except ValidationError as e:
      
      return jsonify(e.messages), 400
    
    customer.username = customer_data['username'],
    customer.password = customer_data['password']
                                      
    db.session.commit()

    return jsonify({"message": "Customer's account info updated successfully"}), 201


@app.route('/customer__accounts/<int:id>', methods=['DELETE'])
def delete_customer_account(id):
    
    customer = Customer.query.first_or_404(id)
    account = CustomerAccount.query.first_or_404(customer)
    db.session.delete(account)
    db.session.commit()
    
    return jsonify({"message": "Customer deleted successfully"}), 201




#### Routes for Products/ Product Management ####

# Get list of all products

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return products_schema.jsonify(products)

# route to add new products

@app.route('/products', methods=['POST'])
def add_a_product():
   try:
     product_data = product_schema.load(request.json)
   except ValidationError as e:
     print(f'Validation Error: {e}')
     return jsonify(e.messages), 400

   new_product = Product(name = product_data["name"],
                          price = product_data["price"])
   db.session.add(new_product)
   db.session.commit()
       
   return jsonify({"message": "New product added successfully"}), 201


####  Update Product: Create an endpoint for updating product details, 


@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.one_or_404(id)
    try:
    
        product_data = product_schema.load(request.json)
     #catch errors in input during update

    except ValidationError as e:
      
      return jsonify(e.messages), 400
    
   
    product.name  =  product_data['name']
    product.price  = product_data['price']
   # product.category  = product_data['category']
    
    
    db.session.commit()

    return jsonify({"message": "Product info updated successfully"}), 201

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({"message": "Product deleted successfully"}), 201


##### List Products: Develop an endpoint to list all available products 
# in the e-commerce platform.
 ##   Ensure that the list provides essential product information.

# ___________________________________________________________________________


#Order Processing: Develop comprehensive Orders Management functionality to efficiently 
#handle customer orders, ensuring that customers can place, track, and manage their 
#orders seamlessly.



#Place Order:
#  Create an endpoint for customers to place new orders,
# specifying the products they wish to purchase and providing essential order details.
 #  
    #Each order should 
 # 
 # capture the order date and the associated customer.

@app.route('/orders', methods=['POST'])
def add_a_order():
   try:
     order_data = order_schema.load(request.json)
   except ValidationError as e:
     print(f'Validation Error: {e}')
     return jsonify(e.messages), 400

   new_order = Order(name = order_data["name"],
                          price = order_data["price"])
   db.session.add(new_order)
   db.session.commit()
       
   return jsonify({"message": "New order added successfully"}), 201


#Retrieve Order: Implement an endpoint that allows customers to retrieve details of a
 #specific order based on its unique identifier (ID). Provide a clear overview of the order,
  #including the order date and associated products.

#Track Order: Develop functionality that enables customers to track the status
 #and progress of their orders. Customers should be able to access information
 # such as order dates and expected delivery dates.


with app.app_context():
    db.create_all()

if __name__ == ('__main__'):
    app.run(debug=True)