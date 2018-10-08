import React from 'react'
import styled from "styled-components";
import 'semantic-ui-css/semantic.min.css';
import { Button, Form, Grid, Header, Segment, Message } from 'semantic-ui-react'


/* Style-Wrapper */
const SigninFormWrapper = styled.div`
    max-width: 500px;
    max-height: 440px;
    margin: 0 auto;
    position: relative;
    top: 30%;
    border-radius: 8px;
    background-color: transparent;
    background: rgba(255,255,255,1);
`;
/* Component */
const SigninForm = (props)=>{
    const {
        handleInputEmail, handleInputPassword,
        handleSignin, handleMoveSignupPage
    } = props;
    return (
        <SigninFormWrapper>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='grey' textAlign='center'>
                        {'Log-in to your account'}
                    </Header>
                    <Form size='large'>
                        <Segment>
                            <Form.Input
                                icon='user' iconPosition='left' fluid
                                placeholder='E-mail address'
                                onChange={handleInputEmail} />
                            <Form.Input
                                icon='lock' iconPosition='left' fluid
                                placeholder='Password'
                                type='password'
                                onChange={handleInputPassword} />
                            <Button
                                color='blue' size='large' fluid
                                onClick={handleSignin}>
                                {'Signin'}
                            </Button>
                        </Segment>
                        <Message>
                            {'New to here? '}
                            <a role='button' style={{'cursor':'pointer'}} onClick={handleMoveSignupPage}>
                                {'Sign Up'}
                            </a>
                        </Message>
                    </Form>
                </Grid.Column>
            </Grid>
        </SigninFormWrapper>
    );
};
export default SigninForm;