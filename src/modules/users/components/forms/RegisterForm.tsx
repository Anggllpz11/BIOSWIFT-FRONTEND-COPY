import React, { useState } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import * as Yup from 'yup'; 

import { logoutService, register } from '../../services/authService';
import { AxiosResponse } from 'axios';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterForm.css'
import useUserRoleVerifier from '../../hooks/useUserRoleVerifier';





const RegisterUserForm = ()=>{
    const loggedIn = useSessionStorage('sessionJWTToken');
    const isAdmin = useUserRoleVerifier(['administrador']);
    const navigate = useNavigate();
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const initialValues = {
        number: 0,
        username: '',
        password: 'ClaveTemporal1234',
        name: '',
        cedula: 0,
        telefono: '',
        email: '',
        more_info: '',
        roles: '',
        type: '', // Agregar type
        titulo: '', // Agregar titulo
        reg_invima: '', // Agregar reg_invima
    }
    if (!isAdmin) {
        return (
            <div>
                <p>No puedes hacer esto</p>
            </div>
        );
    }
    // Schema Validation with Yup
    const registerUserSchema = Yup.object().shape(
        {
            number: Yup.number()
                .required('Number must be required'),
            username: Yup.string()
                .matches(/^[a-zA-Z]+\.[a-zA-Z]+$/, 'Invalid username format: TRY [firstname.lastname]')
                .required('Username is mandatory'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .max(32, 'Password must be at most 32 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
                )
                .required('Password is required'),
            name: Yup.string()
                .matches(
                    /^[A-Z][a-z]+ [A-Z][a-z]+$/,
                    'Name must be in the format "Firstname Lastname"'
                )
                .required(' Name is required'),
            cedula: Yup.number().required('Identification must be entered'),
            telefono: Yup.string()
                .matches(/^\+\d{2} \d+$/, 'Invalid phone number format')
                .required('Telephone number format must be country code + phone number. Example: (+57 3102121212)'),
            email: Yup.string()
                .email('Invalid email format: [email@email.com]')
                .required('Email is required'),
            more_info: Yup.string()
                .required('More information is required. Try to enter user function: "Developer" '),
        }
    );    
    return (
        <div className='RegisterForm-body'>
            
                {/* Formik wrapper */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={registerUserSchema}
                    onSubmit={async (values) => {
                        console.log("Submitting form: ", values);
                        if (!loggedIn) {
                            logoutService();
                            return;
                        }
    
                        const rolesArray = [{ name: values.roles }];
    
                        try {
                            const response: AxiosResponse = await register(
                                values.number,
                                values.username,
                                values.password,
                                values.name,
                                values.cedula,
                                values.telefono,
                                values.email,
                                values.more_info,
                                rolesArray,
                                values.type,
                                values.titulo,
                                values.reg_invima
                            );
    
                            if (response.status === 200) {
                                console.log('User registered successfully');
                                console.log(response.data);
                                navigate('/user-registered-successfull');
                            } else {
                                throw new Error('Register Error');
                            }
                        } catch (error) {
                            console.error(`[REGISTER ERROR]: Something went wrong: ${error}`);
                        }
                    }}
                
                >
                    {
                            ({values, touched, errors, isSubmitting, handleChange, handleBlur, }) => (
                    <div className='RegisterForm-box'>
                                <Form className='RegisterForm-form'>
                                <div className='RegisterForm-title-div'>
                                    <h2 >Registrar Usuario</h2>
                                </div>
                                { /* Number Field*/ }
                        <div className='Columna-1'>        
                            <div className='RegisterForm-inputBox'>
                                <Field className = 'RegisterForm-Field' id='number' type= 'text' name='number'  />
                                <span>Número de Usuario</span>
                                <i></i>
                                {/* Number Errors*/}
                                {
                                    errors.number && touched.number && (
                                        <ErrorMessage name='number' component='div'> </ErrorMessage>

                                    )
                                }
                                
                            </div>

                            <div className='RegisterForm-inputBox'>
                                { /* Username Field*/ }
                                <Field className = 'RegisterForm-Field' id='username' type= 'username' name='username' />
                                <span>Username</span>
                                <i></i>
                                {/* Username Errors*/}
                                {
                                    errors.username && touched.username && (
                                        <ErrorMessage name='username' component='div'> </ErrorMessage>

                                    )
                                }

                            </div>

                            <div className='RegisterForm-inputBox'>
                                { /* Name Field*/ }
                                <Field className = 'RegisterForm-Field' id='name' type= 'name' name='name'  />
                                <span>Nombre 'Nombre Apellido'</span>
                                <i></i>
                                {/* Name Errors*/}
                                {
                                    errors.name && touched.name && (
                                        <ErrorMessage name='name' component='div'> </ErrorMessage>

                                    )
                                }

                            </div>
                            
                            <div className='RegisterForm-inputBox'>
                                { /* Cedula Field*/ }
                                <Field className = 'RegisterForm-Field' id='cedula' type= 'cedula' name='cedula'/>
                                <span>Cedula</span>
                                <i></i>
                                {/* Cedula Errors*/}
                                {
                                    errors.cedula && touched.cedula && (
                                        <ErrorMessage name='cedula' component='div'> </ErrorMessage>

                                    )
                                }

                            </div>
                        </div>    
                        <div className='Columna-2'>          
                            <div className='RegisterForm-inputBox'>
                                { /* Telefono Field*/ }
                                <Field className = 'RegisterForm-Field' id='telefono' type= 'telefono' name='telefono'/>
                                <span>Telefono</span> 
                                <i></i>
                                {/* Telefono Errors*/}
                                {
                                    errors.telefono && touched.telefono && (
                                        <ErrorMessage name='telefono' component='div'> </ErrorMessage>

                                    )
                                }
                            </div>

                            <div className='RegisterForm-inputBox'>
                                { /* email Field*/ }
                                <Field className = 'RegisterForm-Field' id='email' type= 'email' name='email'/>
                                <span>Email</span>
                                <i></i>
                                {/* email Errors*/}
                                {
                                    errors.email && touched.email && (
                                        <ErrorMessage name='email' component='div'> </ErrorMessage>

                                    )
                                }
                            </div>


                            <div className='RegisterForm-inputBox'>
                                { /* More Info Field*/ }
                                <Field className = 'RegisterForm-Field' id='more_info' type= 'more_info' name='more_info'  />
                                <span>Mas Información</span>
                                <i></i>
                                {/* More Info Errors*/}
                                {
                                    errors.more_info && touched.more_info && (
                                        <ErrorMessage name='email' component='div'> </ErrorMessage>

                                    )
                                }

                            </div>

                            <div className='RegisterForm-inputBox'>
                                { /* Roles Field */ }
                                <Field
                                    as="select"
                                    name="roles"
                                    className="RegisterForm-Field"
                                    id="roles"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        // Actualizar el valor de roles en el formulario
                                        handleChange(e);

                                        // Mostrar campos adicionales si se selecciona 'Técnico'
                                        setShowAdditionalFields(e.target.value === 'tecnico');
                                    }}
                                    value={values.roles}
                                    >
                                <option value='' disabled>Seleccione un rol</option>
                                <option value='user'>Invitado</option>
                                <option value='tecnico'>Técnico</option>
                                <option value='coordinador'>Coordinador</option>
                                <option value='analista'>Analista</option>
                                <option value='comercial'>Comercial</option>
                                <option value='contabilidad'>Contable</option>
                                <option value='almacen'>Almacén</option>
                                

                                </Field>
                                <span>Tipo de Rol</span>
                                <i></i>
                                {/* Agrega más opciones de roles según tus necesidades */}
                                {/* Roles Errors */}
                                {
                                    errors.roles && touched.roles && (
                                        <ErrorMessage name='roles' component='div'> </ErrorMessage>
                                    )
                                }

                            </div>
                            {showAdditionalFields && (
                <div>
                    <div className='RegisterForm-inputBox'>
                        {/* Type Field */}
                        <Field className='RegisterForm-Field' id='type' type='text' name='type' />
                        <span>Tipo de Técnico</span>
                        <i></i>
                        {/* Type Errors */}
                        {
                            errors.type && touched.type && (
                                <ErrorMessage name='type' component='div'></ErrorMessage>
                            )
                        }
                    </div>

                    <div className='RegisterForm-inputBox'>
                        {/* Titulo Field */}
                        <Field className='RegisterForm-Field' id='titulo' type='text' name='titulo' />
                        <span>Título de Técnico</span>
                        <i></i>
                        {/* Titulo Errors */}
                        {
                            errors.titulo && touched.titulo && (
                                <ErrorMessage name='titulo' component='div'></ErrorMessage>
                            )
                        }
                    </div>

                    <div className='RegisterForm-inputBox'>
                        {/* Reg Invima Field */}
                        <Field className='RegisterForm-Field' id='reg_invima' type='text' name='reg_invima' />
                        <span>Número de Registro INVIMA</span>
                        <i></i>
                        {/* Reg Invima Errors */}
                        {
                            errors.reg_invima && touched.reg_invima && (
                                <ErrorMessage name='reg_invima' component='div'></ErrorMessage>
                            )
                        }
                    </div>
                </div>
            )}

                        </div>         
                                {/* Register Button*/}
                                <button className="RegisterForm-button" type="submit">Registrar</button>
                                {/* Message if the form is submitting*/}
                                {
                                    isSubmitting ? (
                                        <p>Registrando...</p> 
                                    ): null
                                }
                     

                                </Form>
                    </div>
                        
                        )
        }






                </Formik>
        </div>
    )

}

export default RegisterUserForm;