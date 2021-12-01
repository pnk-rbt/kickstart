import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Container, Form, Input, Message } from 'semantic-ui-react'

import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import { Router } from '../../routes';
 
export default class CampaignNew extends Component {
  state = {
    errorMessage: '',
    minimumContribution: ''
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true });

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch(error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  }

  onChange = (event) => {
    this.setState({
      errorMessage: '',
      minimumContribution: event.target.value
    });
  };

  render() {
    const {
      errorMessage,
      loading,
      minimumContribution
    } = this.state;

    return (
      <Layout>
        <Container text>
          Create a Campaign
          <Form error={ !!errorMessage } onSubmit={ this.onSubmit }>
            <Form.Field>
              <label>Minimum contribution:</label>
              <Input
                label='wei'
                labelPosition='right'
                placeholder='100'
                value={ minimumContribution }
                onChange={ this.onChange }
              />
            </Form.Field>
            <Message error header='Oops!' content={ errorMessage }
            />
            <Form.Button
              content='Create'
              loading={ loading }
              primary />
          </Form>
        </Container>
      </Layout>
    );
  }
};