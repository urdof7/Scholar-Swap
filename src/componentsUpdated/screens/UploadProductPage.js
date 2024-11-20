import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TwitterIcon from "@mui/icons-material/Twitter";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const UploadProductPage = () => {
  return (
    <Box sx={{ backgroundColor: "#333333", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: "#090a0e",
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src="https://via.placeholder.com/337x350"
            alt="Untitled design"
            style={{ width: 337, height: 350, objectFit: "cover" }}
          />
          <Box sx={{ display: "flex", gap: 4 }}>
            <Typography
              variant="h1"
              sx={{ color: "#fbdc6a", fontFamily: "Quicksand, Helvetica" }}
            >
              Buy
            </Typography>
            <Typography
              variant="h1"
              sx={{ color: "#fbdc6a", fontFamily: "Quicksand, Helvetica" }}
            >
              Sell
            </Typography>
            <Typography
              variant="h1"
              sx={{ color: "#fbdc6a", fontFamily: "Quicksand, Helvetica" }}
            >
              About Us
            </Typography>
          </Box>
          <IconButton>
            <ShoppingCartIcon sx={{ color: "#fbdc6a", fontSize: 70 }} />
          </IconButton>
        </Box>

        <Typography
          variant="h2"
          sx={{
            color: "#fbdc6a",
            textAlign: "center",
            mt: 6,
            fontFamily: "Poppins, Helvetica",
          }}
        >
          Upload Your Materials
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#fbdc6a", fontFamily: "Poppins, Helvetica" }}
            >
              Product Title
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Text here"
              sx={{ mt: 2, backgroundColor: "#d9d9d9", borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#fbdc6a", fontFamily: "Poppins, Helvetica" }}
            >
              Product Description
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="50 words maximum"
              multiline
              rows={4}
              sx={{ mt: 2, backgroundColor: "#d9d9d9", borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#fbdc6a", fontFamily: "Poppins, Helvetica" }}
            >
              Product Category
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Select one"
              sx={{ mt: 2, backgroundColor: "#d9d9d9", borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#fbdc6a", fontFamily: "Poppins, Helvetica" }}
            >
              Upload Photos
            </Typography>
            <Paper
              elevation={3}
              sx={{
                mt: 2,
                p: 4,
                backgroundColor: "#d9d9d9",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <UploadIcon sx={{ fontSize: 70 }} />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#d9d9d9", color: "black", borderRadius: 2 }}
          >
            Upload more products
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#d9d9d9", color: "black", borderRadius: 2 }}
          >
            Finish
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h4"
              sx={{ color: "#404145", fontFamily: "Poppins, Helvetica" }}
            >
              Info
            </Typography>
            <List>
              {[
                "About Us",
                "Support",
                "Blog",
                "Download Apps",
                "The Slack App",
                "Partnerships",
                "Affiliate Program",
              ].map((text) => (
                <ListItem button key={text}>
                  <ListItemText
                    primary={text}
                    sx={{ color: "#7a7d85", textDecoration: "underline" }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h4"
              sx={{ color: "#404145", fontFamily: "Poppins, Helvetica" }}
            >
              Features
            </Typography>
            <List>
              {[
                "Invoicing",
                "Task Management",
                "Contracts",
                "Payments",
                "Recurring payments",
                "Expense Tracking",
                "Reports",
                "Proposals",
                "Time Tracking",
              ].map((text) => (
                <ListItem button key={text}>
                  <ListItemText
                    primary={text}
                    sx={{ color: "#7a7d85", textDecoration: "underline" }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h4"
              sx={{ color: "#404145", fontFamily: "Poppins, Helvetica" }}
            >
              Tools
            </Typography>
            <List>
              {[
                "Free Invoice Templates",
                "Free Invoice Generator",
                "Free Invoicing Guide",
                "Self Employment Tax Calculator",
                "Quarterly Tax Calculator",
                "Business Name Generator",
              ].map((text) => (
                <ListItem button key={text}>
                  <ListItemText
                    primary={text}
                    sx={{ color: "#7a7d85", textDecoration: "underline" }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h4"
              sx={{ color: "#404145", fontFamily: "Poppins, Helvetica" }}
            >
              Helpful Links
            </Typography>
            <List>
              {[
                "Williams & Harricks",
                "Anywhere Workers",
                "Freshbooks Alternative",
                "Quickbooks Alternative",
                "Harvest Alternative",
                "Wave Apps Alternative",
                "Design DB",
              ].map((text) => (
                <ListItem button key={text}>
                  <ListItemText
                    primary={text}
                    sx={{ color: "#7a7d85", textDecoration: "underline" }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h4"
              sx={{ color: "#404145", fontFamily: "Poppins, Helvetica" }}
            >
              Policies
            </Typography>
            <List>
              {["Terms of Service", "Privacy Policy"].map((text) => (
                <ListItem button key={text}>
                  <ListItemText
                    primary={text}
                    sx={{ color: "#7a7d85", textDecoration: "underline" }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <IconButton>
            <TwitterIcon sx={{ color: "#7a7d85" }} />
          </IconButton>
          <IconButton>
            <FacebookIcon sx={{ color: "#7a7d85" }} />
          </IconButton>
          <IconButton>
            <LinkedInIcon sx={{ color: "#7a7d85" }} />
          </IconButton>
          <IconButton>
            <PinterestIcon sx={{ color: "#7a7d85" }} />
          </IconButton>
          <IconButton>
            <InstagramIcon sx={{ color: "#7a7d85" }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadProductPage;

