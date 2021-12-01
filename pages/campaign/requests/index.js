import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import { Button, Table, Grid } from 'semantic-ui-react'

import web3 from '../../../ethereum/web3';
import Campaign from '../../../ethereum/campaign';
import { Link } from '../../../routes';

export default class RequestsIndex extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { 
      approversCount,
      campaignAddress: props.query.address,
      requests,
      requestCount
    };
  }

  renderRequestRows() {
    const { approversCount, campaignAddress } = this.props;
    const rows = this.props.requests.map((request, index) => {
      return (
        <RequestRow
          approversCount={ approversCount }
          campaignAddress={ campaignAddress }
          id={ index } 
          key={ index } 
          request={ request }
        />
      );
    });

    return rows;
  }

  render() {
    const { campaignAddress, requestCount } = this.props;
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Grid>
          <Grid.Column width={10}>
          <Table>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Amount (ether)</HeaderCell>
                <HeaderCell>Recipient</HeaderCell>
                <HeaderCell>Approval Count</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
                <HeaderCell>Finalize</HeaderCell>
              </Row>
            </Header>
            <Body>
              { this.renderRequestRows() }
            </Body>
          </Table>
          </Grid.Column>
          <Grid.Column width={6}>
            <Link route={`/campaign/${campaignAddress}/requests/new`}>
              <a>
                <Button 
                  content="Create a Request"
                  floated="right"
                  icon="add"
                  primary
                />
              </a>
            </Link>
          </Grid.Column>
        </Grid>
        <div>Found { requestCount } requests.</div>
      </Layout>
    );
  }
}