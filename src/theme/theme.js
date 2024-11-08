import { createTheme } from "@mui/material";

const customTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            modal: 730
        }
    }
})

export default customTheme;