from flask_restx import fields, Api

def create_account_model(api: Api):
    return api.model('LoginModel', {
        'email': fields.String(required=True, description='Email', example='test@gmail.com'),
        'password': fields.String(required=True, description='Password', example='test123')
    })


def create_register_model(api: Api):
    return api.model('RegisterModel', {
        'email': fields.String(required=True, description='Email', example='test@gmail.com'),
        'password': fields.String(required=True, description='Password', example='test123'),
        'name': fields.String(required=True, description='Name', example='Phan Nghia'),
        'phone_number': fields.String(required=True, description='Phone number', example='0123456789'),
        'address': fields.String(required=True, description='Address', example='Quận 9, Tp. Hồ Chí Minh'),
        'age': fields.Integer(required=True, description='Age', example=30),
    })

def selected_items_model(api: Api):
    selected_items_model = api.model('SelectedItemsModel', {
        'tools': fields.List(fields.String, required=True, description='Selected tools'),
        'soft_skills': fields.List(fields.String, required=True, description='Selected soft skills'),
        'knowledges': fields.List(fields.String, required=True, description='Selected knowledges'),
        'languages': fields.List(fields.String, required=True, description='Selected languages')
})


