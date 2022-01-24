// Import Express
const express = require("express");

const router = express.Router();
// Import Moment เพื่อไว้จัดรูปแบบวันที่
const moment = require("moment");

// Import mongodb_dbconfig
const { connectDb, getDb } = require("../config/mongodb_dbconfig");
var db;
connectDb(() => (db = getDb()));
router.get("/create_blog", (req, res) => {
  res.render("pages/frontend/create_blog", {
    title: "Create Category",
    heading: "Create Category",
  });
});

router.post("/create_blog", async (req, res) => {
  // รับค่าจากฟอร์ม
  let BlogName = req.body.BlogName;
  let BlogID = req.body.BlogID;
  let BlogTitle = req.body.BlogTitle;
  let BlogDetail = req.body.BlogDetail;
  let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let errors = false;
  if (BlogName === "" || BlogID === "" || BlogTitle === "") {
    errors = true;
    // แสดงข้อความแจ้งเตือน
    req.flash("error", "ป้อนข้อมูลในฟิลด์ให้ครบก่อน");
    // ให้ทำการ reload ฟอร์ม
    res.render("pages/frontend/create_blog", {
      title: "Create Blog",
      heading: "Create Blog",
    });
  } else {
    // Insert to mongodb
    await db.collection("blog").insertOne({
      BlogName: BlogName,
      BlogID: BlogID,
      BlogTitle: BlogTitle,
      BlogDetail: BlogDetail,
      CreatedDate: curdatetime,
      ModifiedDate: curdatetime,
    });

    req.flash("success", "เพิ่มบทความสำเร็จ");

    res.render("pages/frontend/create_blog", {
      title: "Create Blog",
      heading: "Create Blog",
      layouts: "",
    });
  }
});

// Read blog
router.get("/blog", async (req, res) => {
  const blog = await db.collection("blog").find({}).toArray();
  // res.json(blog);
  res.render("pages/frontend/blog", {
    title: "Blog",
    heading: "Blog",
    data: blog,
    moment: moment,
  });
});

router.get("", (req, res) => {
  res.render("pages/frontend/index", { title: "หน้าแรก" });
});

router.get("/about", (req, res) => {
  res.render("pages/frontend/about", { title: "About" });
});

router.get("/login", (req, res) => {
  res.render("pages/frontend/login", {
    title: "เข้าสู่ระบบ",
    layout: "./layouts/authen",
  });
});

router.get("/register", (req, res) => {
  res.render("pages/frontend/register", {
    title: "สมัครสมาชิก",
    layout: "./layouts/authen",
  });
});

router.get("/forgotpassword", (req, res) => {
  res.render("pages/frontend/forgotpassword", {
    title: "ลืมรหัสผ่าน",
    layout: "./layouts/authen",
  });
});

module.exports = router;
