import { Badge, Typography } from "@mui/material";

export const TextIcon = ({ text, Icon }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        justifyContent: "start",
      }}
    > 
      {Icon}
      <p style={{ fontWeight: "bolder" }}>{text}</p>
    </div>
  );
};

export const RoundNameCircle = ({ name = "", status }) => {
  let initialNameValue = "";
  let nameInitials = name.split(" ");
  nameInitials.forEach((value) => (initialNameValue += value[0]));
  return (
    <>
    <div className="roundNameCircle">
      <Badge
        badgeContent={initialNameValue.toUpperCase()}
        id="userBadgeName"
        sx={{
          borderRadius: "50%",
          "&::before": {
            backgroundColor:
              status.toLowerCase() === "deactivated"
                ? "lightgray"
                : status.toLowerCase() === "idle"
                ? "orange"
                : status.toLowerCase() === "active"
                ? "green"
                : status.toLowerCase() === "inactive"
                ? "#ed461c"
                : "none",
          },
          "& span": {
            borderRadius: "50%",
            padding:
              nameInitials.length === 1
                ? "0px 12px"
                : nameInitials.length === 2
                ? "0 8px"
                : "0 3px",
            height: "33px",
            fontWeight: 600,
            backgroundColor: "white",
            color: "#6754E2",
          },
        }}
      ></Badge>
      <Typography variant="span">{name}</Typography>
      {/* <h5 style={{ marginBottom: "15px" }}>{name}</h5> */}
    </div>
    </>
  );
};

export const AdminRoundNameCircle = ({ name = "", status }) => {
  let initialNameValue = "";
  let nameInitials = name.split(" ");
  nameInitials.forEach((value) => (initialNameValue += value[0]));
  return (
    <div className="roundNameCircle">
      <Badge
        badgeContent={initialNameValue.toUpperCase()}
        id="userBadgeName"
        sx={{
          borderRadius: "50%",
          "&::before": {
            backgroundColor:
              status.toLowerCase() === "deactivated"
                ? "lightgray"
                : status.toLowerCase() === "idle"
                ? "orange"
                : status.toLowerCase() === "active"
                ? "green"
                : status.toLowerCase() === "inactive"
                ? "#ed461c"
                : "none",
          },
          "& span": {
            borderRadius: "50%",
            padding:
              nameInitials.length === 1
                ? "0px 12px"
                : nameInitials.length === 2
                ? "0 8px"
                : "0 3px",
            height: "33px",
            fontWeight: 600,
            backgroundColor: "white",
            color: "#6754E2",
          },
        }}
      ></Badge>
    </div>
  );
};

export const BadgeIcon = ({ status }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "80px",
      }}
    >
      <Badge
        badgeContent={status}
        className="statusBadge"
        sx={{
          "& span": {
            textTransform: "capitalize",
            padding: "10px 10px",
            padding: "13px 12px",
            border: "0px",
            borderRadius: "4px",
            color: "white",
            width: "90px",
            fontWeight: 600,
            backgroundColor:
              status.toLowerCase() === "deactivated"
                ? "#f5f5f5"
                : status.toLowerCase() === "idle"
                ? "#f5e6bc"
                : status.toLowerCase() === "active"
                ? "#d8f2d8"
                : status.toLowerCase() === "inactive"
                ? "#f7c7c6"
                : "none",

            color:
              status.toLowerCase() === "deactivated"
                ? "#80848a"
                : status.toLowerCase() === "idle"
                ? "#873f00"
                : status.toLowerCase() === "active"
                ? "green"
                : status.toLowerCase() === "inactive"
                ? "#8f0606"
                : "none",

            letterSpacing: "0.6px",
          },
        }}
      ></Badge>
    </div>
  );
};
