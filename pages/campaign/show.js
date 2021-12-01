import React, { Component } from 'react';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import { Button, Card, Grid } from 'semantic-ui-react'

import { Link } from '../../routes';
import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';
 
export default class CampaignShow extends Component {
  // props passed in from next, different to the one from react
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return { 
      approversCount: summary[3],
      balance: summary[1],
      campaignAddress: props.query.address,
      managerAddress: summary[4],
      minimumContribution: summary[0],
      requestsCount: summary[2]
    };
  }

  renderCards() {
    const {
      approversCount,
      balance,
      managerAddress,
      minimumContribution,
      requestsCount
    } = this.props;

    const items = [
      {
        header: managerAddress,
        description: 'The manager created this campaign and can create and finalize requests.',
        meta: "Manager's Address",
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        description: 'The total amount of contributions (in wei) that have been made to this campaign.',
        meta: 'Balance of Campaign (ether)'
      },
      {
        header: minimumContribution,
        description: 'The minimum amount that can be contributed to this campaign.',
        meta: 'Minimum Contribution (wei)'
      },
      {
        header: approversCount,
        description: 'The number of unique contributors to this campaign.',
        meta: 'Number of Contributors'
      },
      {
        header: requestsCount,
        description: 'The number of fund withdrawal requests that the manager of this campaign has created.',
        meta: 'Number of Withdrawal Requests'
      }
    ];

    return <Card.Group items={ items } />
  }

  render() {
    const {
      campaignAddress,
      minimumContribution
    } = this.props;

    return (
      <Layout>
        {/* <Container text> */}
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                { this.renderCards() }
              </Grid.Column>
              <Grid.Column width={6}>
                <ContributeForm 
                  campaignAddress={ campaignAddress }
                  minimumContribution={ minimumContribution }
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link route={ `/campaign/${campaignAddress}/requests` }>
                  <a>
                    <Button primary content='View Requests'/>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        {/* </Container> */}
      </Layout>
    );
  }
};