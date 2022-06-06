import { Contract, utils } from "ethers";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { abis, addresses } from "@my-app/contracts";
import {
  useEthers,
  useTokenBalance,
  useContractFunction,
  useToken,
} from "@usedapp/core";
import React, { useState } from "react";

const TokenBalance = () => {
  const { account } = useEthers();
  const dercBalance = useTokenBalance(addresses.dErc, account);

  const [sendAddress, setSendAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);

  const dercInfo = useToken(addresses.dErc);

  const erc20_int = new utils.Interface(abis.erc20);
  const contract = new Contract(addresses.dErc, erc20_int);
  const { state, send } = useContractFunction(contract, "transfer", {
    transactionName: "Transfer",
  });

  const { status } = state;

  return (
    <Card sx={{ textAlign: "center" }}>
      <CardHeader
        title="Transfer"
        sx={{ textAlign: "center", minWidth: 125 }}
      />
      {status && <Typography>{status}</Typography>}
      {dercBalance && (
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            height: 200,
          }}
        >
          <TextField
            id="address"
            name="address"
            label="Recepient Address"
            value={sendAddress}
            onChange={(e) => setSendAddress(e.target.value)}
          />
          <TextField
            name="tokenAmount"
            required
            id="token-amount"
            label={`Amount of ${dercInfo.symbol}:`}
            type="number"
            value={tokenAmount}
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            onChange={(e) => setTokenAmount(e.target.value)}
          />
        </CardContent>
      )}
      <Button
        sx={{ marginBottom: 3 }}
        variant="contained"
        onClick={() => send(sendAddress, utils.parseUnits(tokenAmount))}
      >
        Send
      </Button>
    </Card>
  );
};

export default TokenBalance;
