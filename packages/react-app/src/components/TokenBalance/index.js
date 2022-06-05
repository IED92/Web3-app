import { formatEther } from "@ethersproject/units";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addresses } from "@my-app/contracts";
import { useEthers, useTokenBalance } from "@usedapp/core";
import React from "react";

const TokenBalance = () => {
  const { account } = useEthers();
  const dercBalance = useTokenBalance(addresses.dErc, account);

  return (
    <Card sx={{ height: 125 }}>
      <CardHeader
        title="Balances"
        sx={{ textAlign: "center", minWidth: 125 }}
      />
      {dercBalance && (
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Typography>DERC:</Typography>
            <Typography>{formatEther(dercBalance)}</Typography>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default TokenBalance;
