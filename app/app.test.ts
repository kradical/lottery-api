import app from "./app";

test("App Environment", (): void => {
  expect(app.settings.env).toEqual("test");
});

test("App Base Path", (): void => {
  expect(app.mountpath).toEqual("/");
});
