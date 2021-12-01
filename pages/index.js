import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react'
import { Link } from '../routes';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

export default class CampaignIndex extends Component {
  // getInitialProps is next's equivalent to componentDidMount
  // it's a custom lifecycle method to avoid issues
  // related to next using server-side rendering
  // instead of client-side rendering like normal react
  static async getInitialProps() {
    const campaignAddresses = await factory.methods.getDeployedCampaigns().call();
    return { campaignAddresses };
  }

  renderCampaigns() {
    const items = this.props.campaignAddresses.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaign/${address}`}>
            <a>View Campaign</a>
          </Link>),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Link route='/campaign/new'>
          <a>
            <Button 
              content="Create a Campaign"
              floated="right"
              icon="add"
              primary
            />
          </a>
        </Link>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}