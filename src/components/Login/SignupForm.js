import React from 'react'
import styled from "styled-components";
import 'semantic-ui-css/semantic.min.css';
import { Button, Form, Grid, Header, Segment, Message } from 'semantic-ui-react'


/* Style-Wrapper */
const SignupFormWrapper = styled.div`
    max-width: 500px;
    max-height: 440px;
    margin: 0 auto;
    position: relative;
    top: 30%;
    border-radius: 8px;
    background-color: transparent;
    background: rgba(255,255,255,1);
    z-index: 1000000003;
`;
/* Component */
const SignupForm = (props)=>{
    const {
        handleInputSignupEmail, handleInputSignupPassword, handleInputSignupPasswordAgain,
        handleClickSignupButton, handleClickGoToLoginButton
    } = props;
    return (
        <SignupFormWrapper>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='grey' textAlign='center'>
                        {'Create new account'}
                    </Header>
                    <Form size='large'>
                        <Segment>
                            <Form.Input
                                icon='user' iconPosition='left' fluid
                                placeholder='E-mail address'
                                onChange={handleInputSignupEmail} />
                            <Form.Input
                                icon='lock' iconPosition='left' fluid
                                placeholder='Password'
                                type='password'
                                onChange={handleInputSignupPassword} />
                            <Form.Input
                                icon='lock' iconPosition='left' fluid
                                placeholder='Password Confirm'
                                type='password'
                                onChange={handleInputSignupPasswordAgain} />
                            <Button
                                color='blue' size='large' fluid
                                onClick={handleClickSignupButton}>
                                {'Signup'}
                            </Button>
                        </Segment>
                        <Message>
                            {'Already be registered? '}
                            <a role='button' onClick={handleClickGoToLoginButton}>
                                {'Login'}
                            </a>
                        </Message>
                    </Form>
                </Grid.Column>
            </Grid>
        </SignupFormWrapper>
    );
};
export default SignupForm;