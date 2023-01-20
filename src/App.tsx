import './App.css';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { injected } from './blockchain/metamaskConnector';
import NodeManagerAbi from "./blockchain/abi/NodeManager.json";
import PonziXAbi from "./blockchain/abi/PonziX.json";
import { CardContent, CircularProgress, Grid, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Web3 from 'web3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/*
struct Node {
    uint32 id;
    uint8 tierIndex;
    address owner;
    uint32 createdTime;
    uint32 claimedTime;
    uint256 multiplier;
}

struct Tier {
    uint8 id;
    string name;
    uint256 price;
    uint256 rewardsPerTime;
    uint32 claimInterval;
    uint256 maintenanceFee;
}
*/

type Tier = {
  id: number,
  name: string,
  price: number,
  rewardsPerTime: number,
  claimInterval: number,
  maintenanceFee: number
}

type Node = {
  id: number,
  tierIndex: number,
  owner: string,
  createdTime: number,
  claimedTime: number,
  multiplier: number
}

type TableRowData = {
  id: number,
  claimableAmount: string,
  claimedTime: string,
}


function App() {
  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();

  const NodeManagerAddress = "0xF193c3090aF70BC86c0c38BEBf349fA39762F6dE";
  const PonziXAddress = "0x629C4607C42A018E11416BB6f7B6adD3B4F03384"

  const [countTotal, setCountTotal] = useState(0);
  const [myNodesNumber, setMyNodesNumber] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [tiers, setTiers] = useState<Tier[]>([]);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [numberOfNodes, setNumberOfNodes] = useState(1);
  const [balance, setBalance] = useState(0);
  const [isCreateNodeLoading, setIsCreateNodeLoading] = useState(false);


  // new array of nodes
  const [myNodes, setMyNodes] = useState<Node[]>([]);
  const [rows, setRows] = useState<TableRowData[]>([]);
  let nodeRewardsContract: any;
  let tokenContract: any;


  function createNodeTableData(
    id: number,
    claimedTime: string,
    claimableAmount: string
  ): TableRowData {
    return { id, claimedTime, claimableAmount };
  }

  const getNodesData = async () => {
    nodeRewardsContract
      .countTotal()
      .call()
      .then((res: any) => {
        console.log("res", res);
        setCountTotal(res);
      });

    nodeRewardsContract
      .countOfUser(account)
      .call()
      .then((res: any) => {
        console.log("res", res);
        setMyNodesNumber(res);
      });

    nodeRewardsContract
      .claimable(account)
      .call()
      .then((res: any) => {
        console.log("res", res);
        setClaimableAmount(res);
      });

    nodeRewardsContract
      .tiers()
      .call()
      .then((tiersReceived: Tier[]) => {
        setTiers(tiers)

        nodeRewardsContract
          .nodes(account)
          .call()
          .then((res: Node[]) => {
            console.log("setMyNodes", res);

            setMyNodes(res);
            setRows(res.map((node: Node) => {

              let claimeableAmount = (((new Date().getTime() / 1000 - node.claimedTime) * tiersReceived[0].rewardsPerTime) / tiersReceived[0].claimInterval);


              // convert node.claimedTime to 2021-10-10 10:10:10
              const date = new Date(node.claimedTime * 1000);
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const hours = date.getHours();
              const minutes = "0" + date.getMinutes();
              const seconds = "0" + date.getSeconds();
              const formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
              const t = createNodeTableData(
                node.id,
                formattedTime,
                Number(Web3.utils.fromWei(claimeableAmount.toString())).toFixed(4),
              )
              return t;
            }));
          });
      });


    tokenContract.balanceOf(account)
      .call()
      .then((res: any) => {
        console.log("balanceOf", res);
        setTokenBalance(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
    getAllowance();

  };

  useEffect(() => {
    if (account) {

      nodeRewardsContract = new library.eth.Contract(
        NodeManagerAbi,
        NodeManagerAddress
      ).methods;

      tokenContract = new library.eth.Contract(
        PonziXAbi,
        PonziXAddress
      ).methods;

      getNodesData().then(() => {
        console.log("done");
      });
    }
  }, [account]);

  useEffect(() => {
    const isWalletConnected = localStorage.getItem('isWalletConnected');
    const connector = localStorage.getItem('connector');
    if (isWalletConnected === 'true' && connector === 'injected') {
      activate(injected);
    }
  }, [active]);

  async function connectMetamaks() {
    try {
      await activate(injected, undefined, true);
      localStorage.setItem("connector", "injected");
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }

  function getWalletAbreviation(walletAddress: string | null | undefined): string {
    if (walletAddress !== null && walletAddress !== undefined) {
      return walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    }
    return ""
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
      localStorage.removeItem("connector");
    } catch (ex) {
      console.log(ex);
    }
  }



  const claimTokens = async () => {

    if (account) {

      nodeRewardsContract = new library.eth.Contract(
        NodeManagerAbi,
        NodeManagerAddress
      ).methods;

      nodeRewardsContract
        .claim()
        .send({ from: account })
        .then((res: any) => {
          console.log("res", res);
          toast.success("Claim successful!");

          getNodesData().then(() => {
            console.log("done");
          });

        });
    }
  };

  const onChangeNumberOfNodes = (e: any) => {
    setNumberOfNodes(e.target.value);
  };

  const createNode = async () => {
    console.log("nodeRewardsContract", nodeRewardsContract)
    if (account) {

      nodeRewardsContract = new library.eth.Contract(
        NodeManagerAbi,
        NodeManagerAddress
      ).methods;

      tokenContract = new library.eth.Contract(
        PonziXAbi,
        PonziXAddress
      ).methods;

      getTokenBalance();


      const tokenCurrentBalance = Number(Number(Web3.utils.fromWei(tokenBalance.toString())).toFixed(4));

      if (tokenCurrentBalance < 100 * numberOfNodes) {
        toast.error("Insufficient $PZX balance");
        return;
      }
      else {
        setIsCreateNodeLoading(true);
        nodeRewardsContract
          .create("basic", numberOfNodes)
          .send({ from: account })
          .then((res: any) => {
            console.log("res", res);
            toast.success("Node created successfully!");
            setIsCreateNodeLoading(false);

            getNodesData().then(() => {
              console.log("done");
            });
          }).catch((e: any) => {
            console.log("error", e);
            toast.error(e.message);
            setIsCreateNodeLoading(false);
          });
      }


    }
  };

  const approve = async () => {

    if (account) {
      tokenContract = new library.eth.Contract(
        PonziXAbi,
        PonziXAddress
      ).methods;


      tokenContract.approve(
        NodeManagerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
        .send({ from: account })
        .then((r: any) => {
          setAllowance(r);
          toast.success("Congratulations! $PZX spend approved, now you can create nodes.");
          console.log(
            "Congratulations! $PZX spend approved, now you can create nodes."
          );
        })
        .catch((e: any) => {
          toast.error(
            e.message
          );
        });
    }
  };

  const compoundNodes = async () => {

    if (account) {

      nodeRewardsContract = new library.eth.Contract(
        NodeManagerAbi,
        NodeManagerAddress
      ).methods;


      const parsedClaimableAmount = Number(Web3.utils.fromWei(claimableAmount.toString())).toFixed(4);

      let compoundAmount = Math.floor(Number(parsedClaimableAmount) / 100);
      console.log("compoundAmount", compoundAmount);

      if (compoundAmount < 1) {
        toast.error("You need at least 100 tokens in rewards to compound!");
        return;
      }

      if (compoundAmount > 100) {
        compoundAmount = 80;
      }

      nodeRewardsContract
        .compound('basic', compoundAmount)
        .send({ from: account })
        .then((res: any) => {
          console.log("res", res);
          toast.success("Compound successful!");

          getNodesData().then(() => {
            console.log("done");
          });

        }, (err: any) => {
          console.log("err", err);
          toast.error(err.message);
        });
    }
  };

  const getTokenBalance = async () => {
    if (account) {
      // get allowance
      tokenContract.balanceOf(account)
        .call()
        .then((res: any) => {
          console.log("balanceOf", res);
          setTokenBalance(res);
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
  };

  const getAllowance = async () => {
    if (account) {

      // get allowance
      tokenContract.allowance(account, NodeManagerAddress)
        .call()
        .then((res: any) => {
          console.log("setAllowance", res);
          setAllowance(res);

        });
    }

  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
            </Typography>
            <Button variant="contained" color={active ? 'success' : 'inherit'} onClick={active ? disconnect : connectMetamaks}>        {active ? (
              <span>
                <b> {getWalletAbreviation(account)}</b>
              </span>
            ) : (
              <span>Connect Wallet</span>
            )}</Button>
          </Toolbar>
        </AppBar>

        {/* Create Grid responsive for mobile with 6 cards, if the screen size is small split in 2 rows */}
        <Grid container
          spacing={2}
          sx={{ p: 2 }}
          alignItems="center"
          justifyContent="center">
          <Grid item xs={8} sm={4} md={2}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Nodes
                </Typography>
                <Typography variant="body2">
                  {countTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sm={4} md={2}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  My Nodes
                </Typography>
                <Typography variant="body2">
                  {myNodesNumber}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sm={4} md={2}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  Token Price 10$  <Button variant="contained" onClick={approve}>Buy</Button>
                </Typography>
                <Typography variant="body2">
                  10$
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sm={4} md={2}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  Tokens in rewards
                </Typography>
                <Typography variant="body2">
                  100 PZX
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sm={4} md={2}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  Tokens in development
                </Typography>
                <Typography variant="body2">
                  100 PZX
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sm={4} md={2}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  Tokens in development
                </Typography>
                <Typography variant="body2">
                  100 PZX
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Create responsive grid with two cards */}
        <Grid container
          spacing={2}
          sx={{ mt: 2 }}
          alignItems="center"
          justifyContent="center">

          <Grid item xs={8} sm={4} md={6}>
            <Card sx={{ borderRadius: '16px' }} >
              <CardContent>
                <Typography variant="h6" component="div">
                  Create
                </Typography>
                <Typography variant="body2">
                  Daily rewards: 0.17 $PZX
                </Typography>
                <Typography variant="body2">
                  Node cost: 10 $PZX
                </Typography>
                <Typography variant="body2">
                  Claim tax: 10%
                </Typography>
                <Typography variant="body2">
                  Balance: {Number(Web3.utils.fromWei(tokenBalance.toString(), 'ether')).toFixed(4)}
                </Typography>

                <TextField type='number' id="outlined-basic" label="Node Name" variant="outlined" value={numberOfNodes} onChange={onChangeNumberOfNodes} />


                {Number(Number(Web3.utils.fromWei(allowance.toString(), 'ether')).toFixed(4)) === 0 ?
                  <Button variant="contained" size="small" onClick={approve}>Approve {isCreateNodeLoading ? <CircularProgress /> : null} </Button>
                  :
                  <Button variant="contained" size="small" onClick={createNode}>
                    Create Nodes
                    {isCreateNodeLoading ? <CircularProgress size={20} /> : null}
                  </Button>
                }
              </CardContent>
            </Card>
          </Grid>
          {myNodes.length > 0 ?
            <Grid item xs={11} sm={4} md={6}>
              <Card sx={{ borderRadius: '16px' }} >

                <CardContent>
                  <Typography variant="h6" component="div">
                    My nodes
                  </Typography>

                  <TableContainer component={Paper}

                    sx={{
                      border: "4px solid rgba(0,0,0,0.2)",
                      padding: 1,
                      width: '100%',
                      height: 400,
                      "&::-webkit-scrollbar": {
                        width: 20
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "orange"
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "red",
                        borderRadius: 2
                      },
                      overflowX: "hidden"
                    }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Calories</TableCell>
                          <TableCell align="right">Fat&nbsp;(g)</TableCell>
                          <TableCell align="right">Carbs&nbsp;(g)</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="right">{row.id}</TableCell>
                            <TableCell align="right">{row.claimableAmount}</TableCell>
                            <TableCell align="right">{row.claimedTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>


                  <Typography variant="body2">
                    {Number(Web3.utils.fromWei(claimableAmount.toString(), 'ether')).toFixed(4)}
                  </Typography>


                  <Button variant="contained" size="small" onClick={claimTokens}>Claim rewards{isCreateNodeLoading ? <CircularProgress /> : null} </Button>


                  {Number(Web3.utils.fromWei(claimableAmount.toString(), 'ether')).toFixed(4) > '100' ?
                    <Button variant="contained" size="small" onClick={compoundNodes}>
                      Compound
                      {isCreateNodeLoading ? <CircularProgress size={20} /> : null}
                    </Button>
                    : null
                  }

                </CardContent>
              </Card>
            </Grid>
            : null}
        </Grid>

        <ToastContainer />
      </Box>
    </div>
  );
}



export default App;
