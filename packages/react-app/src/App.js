import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import {
  shortenAddress,
  useCall,
  useEthers,
  useLookupAddress,
} from "@usedapp/core";
import React, { useEffect, useState } from "react";
import logo from "./ethereumLogo.png";

import { Container, Button } from "@mui/material";

import { addresses, abis } from "@my-app/contracts";
import GET_TRANSFERS from "./graphql/subgraph";
import TokenBalance from "./components/TokenBalance";
import TokenTransfer from "./components/TokenTransfer";
import { Box } from "@mui/system";
import { blueGrey } from "@mui/material/colors";

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const ens = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      variant="contained"
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
      sx={{ marginLeft: 3, marginBottom: 3 }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  const greyblue = blueGrey[900];
  // Read more about useDapp on https://usedapp.io/
  const { error: contractCallError, value: tokenBalance } =
    useCall({
      contract: new Contract(addresses.dErc, abis.erc20),
      method: "balanceOf",
      args: ["0x6B2fdE613D81d55ad84F902758bcbD0b68e3bb20"],
    }) ?? {};

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  useEffect(() => {
    if (subgraphQueryError) {
      console.error(
        "Error while querying subgraph:",
        subgraphQueryError.message
      );
      return;
    }
    if (!loading && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, subgraphQueryError, data]);

  return (
    <Container
      maxWidth={false}
      sx={{
        bgcolor: greyblue,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          width: 500,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          style={{
            width: 50,
            marginBottom: 20,
          }}
          src={logo}
          alt="ethereum-logo"
        />
        <WalletButton />
      </Box>
      <Box
        sx={{
          minWidth: 550,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TokenBalance />
        <TokenTransfer />
      </Box>
    </Container>
  );
}

export default App;
